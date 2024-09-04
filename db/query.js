const pool = require("./pool");


async function getData() {
    const { rows } = await pool.query('select * from fruits;');
    return rows;
}

async function getById(id) {
    try {
        const fruitResult = await pool.query('SELECT * FROM fruits WHERE name = $1', [id]);
        const nutritionResult = await pool.query('SELECT * FROM nutritions WHERE name = $1', [id]); // Assuming 'id' in 'nutritions' table references the fruit

        const fruit = fruitResult.rows[0];
        const nutrition = nutritionResult.rows[0];

        if (!fruit) {
            throw new Error('Fruit not found');
        }

        return { fruit, nutrition };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throwing the error so it can be handled by the calling function
    }
}

async function getByFamilyName(id) {
    const fruitResult = await pool.query('SELECT * FROM fruits WHERE family = $1', [id]);
    return fruitResult.rows;
}

async function storeInDb(obj, imgUrl) {
    try {
        // Inserting into the 'fruits' table
        await pool.query(
            'INSERT INTO fruits (name, family, f_order, genus, f_imgs) VALUES ($1, $2, $3, $4, $5)',
            [obj.name, obj.family, obj.f_order, obj.genus, imgUrl]
        );

        // Inserting into the 'nutritions' table
        await pool.query(
            'INSERT INTO nutritions (calories, fat, sugar, carbohydrates, protein, name) VALUES ($1, $2, $3, $4, $5, $6)',
            [obj.calories, obj.fat, obj.sugar, obj.carbohydrates, obj.protein, obj.name]
        );
    } catch (error) {
        console.error('Error storing data in DB:', error);
        throw error; // Re-throw the error so it can be handled further up the call stack
    }
}



async function getFruitsFamily() {
    const response = await pool.query('SELECT DISTINCT family FROM fruits;');
    return response.rows;
}



module.exports = {
    getData,
    getById,
    getFruitsFamily,
    getByFamilyName,
    storeInDb
}
