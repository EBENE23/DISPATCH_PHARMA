const Doctor = require('../models/Doctor');

// ========== CRÉER UN MÉDECIN ==========
exports.createDoctor = async (req, res) => {
  try {
    const doctorData = {
      ...req.body,
      createdBy: req.userId
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Médecin ajouté avec succès',
      doctor: doctor
    });

  } catch (error) {
    console.error('Erreur création médecin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du médecin',
      error: error.message
    });
  }
};

// ========== OBTENIR TOUS LES MÉDECINS ==========
exports.getAllDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, specialty, status } = req.query;
    
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (specialty) {
      query.specialty = specialty;
    }
    
    if (status) {
      query.status = status;
    }

    const doctors = await Doctor.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      doctors: doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total
    });

  } catch (error) {
    console.error('Erreur récupération médecins:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des médecins',
      error: error.message
    });
  }
};

// ========== OBTENIR UN MÉDECIN PAR ID ==========
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé'
      });
    }

    res.json({
      success: true,
      doctor: doctor
    });

  } catch (error) {
    console.error('Erreur récupération médecin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du médecin',
      error: error.message
    });
  }
};

// ========== METTRE À JOUR UN MÉDECIN ==========
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Médecin mis à jour avec succès',
      doctor: doctor
    });

  } catch (error) {
    console.error('Erreur mise à jour médecin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du médecin',
      error: error.message
    });
  }
};

// ========== SUPPRIMER UN MÉDECIN ==========
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Médecin supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression médecin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du médecin',
      error: error.message
    });
  }
};

// ========== OBTENIR LES STATISTIQUES DES MÉDECINS ==========
exports.getDoctorStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const activeDoctors = await Doctor.countDocuments({ status: 'active' });
    const topSpecialties = await Doctor.aggregate([
      { $group: { _id: '$specialty', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalDoctors,
        active: activeDoctors,
        inactive: totalDoctors - activeDoctors,
        topSpecialties: topSpecialties
      }
    });

  } catch (error) {
    console.error('Erreur statistiques médecins:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};