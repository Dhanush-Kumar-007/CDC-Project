const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const resumeDir = path.join(__dirname, '..', 'uploads', 'resumes');
const logoDir = path.join(__dirname, '..', 'uploads', 'logos');
ensureDir(resumeDir);
ensureDir(logoDir);

const makeStorage = (dir, prefix) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const safeBase = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 40);
      cb(null, `${prefix}_${safeBase}_${Date.now()}${ext}`);
    },
  });

const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') return cb(null, true);
  cb(new Error('Only PDF files are allowed for resumes'));
};

const logoFileFilter = (req, file, cb) => {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only PNG, JPEG, or WEBP images are allowed for logos'));
};

const uploadResume = multer({
  storage: makeStorage(resumeDir, 'resume'),
  fileFilter: resumeFileFilter,
  limits: { fileSize: (Number(process.env.MAX_RESUME_SIZE_MB) || 5) * 1024 * 1024 },
});

const uploadLogo = multer({
  storage: makeStorage(logoDir, 'logo'),
  fileFilter: logoFileFilter,
  limits: { fileSize: (Number(process.env.MAX_LOGO_SIZE_MB) || 2) * 1024 * 1024 },
});

module.exports = { uploadResume, uploadLogo };
