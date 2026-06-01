const Product = require('../models/Product');

// ========== CRÉER UN PRODUIT ==========
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Produit ajouté avec succès',
      product: product
    });

  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit',
      error: error.message
    });
  }
};

// ========== OBTENIR TOUS LES PRODUITS ==========
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, minPrice, maxPrice } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(query)
      .sort({ salesCount: -1, rating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products: products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total
    });

  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message
    });
  }
};

// ========== OBTENIR UN PRODUIT PAR ID ==========
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit',
      error: error.message
    });
  }
};

// ========== METTRE À JOUR UN PRODUIT ==========
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      product: product
    });

  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du produit',
      error: error.message
    });
  }
};

// ========== SUPPRIMER UN PRODUIT ==========
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit',
      error: error.message
    });
  }
};

// ========== METTRE À JOUR LE STOCK ==========
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Stock mis à jour avec succès',
      product: product
    });

  } catch (error) {
    console.error('Erreur mise à jour stock:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du stock',
      error: error.message
    });
  }
};

// ========== OBTENIR LES CATÉGORIES ==========
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    
    res.json({
      success: true,
      categories: categories
    });

  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
};