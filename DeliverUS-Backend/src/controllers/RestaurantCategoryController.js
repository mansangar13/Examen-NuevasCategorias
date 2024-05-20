import { RestaurantCategory, sequelizeSession } from '../models/models.js'

const index = async function (req, res) {
  try {
    const restaurantCategories = await RestaurantCategory.findAll()
    res.json(restaurantCategories)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  const { name } = req.body
  if (name.length > 50) {
    return res.status(400).json({ message: 'Name is too long' })
  }
  const t = await sequelizeSession.transaction()
  try {
    // Verificar si la categoría ya existe dentro de la transacción
    const existingCategory = await RestaurantCategory.findOne({ where: { name }, transaction: t })
    if (existingCategory) {
      return res.status(409).json({ message: 'Category already exists' })
    }
    // Crear la nueva categoría dentro de la transacción
    const newCategory = await RestaurantCategory.create({ name }, { transaction: t })
    await t.commit() // Confirmar la transacción si todo va bien
    res.status(201).json(newCategory)
  } catch (err) {
    await t.rollback() // Deshacer la transacción en caso de error
    res.status(500).send(err)
  }
}

const RestaurantCategoryController = {
  index,
  create
}
export default RestaurantCategoryController
