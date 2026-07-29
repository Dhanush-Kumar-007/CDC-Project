import { useState } from 'react';
import { FiFileText, FiUpload } from 'react-icons/fi';
import Button from '../common/Button';
import { uploadMyResume } from '../../services/studentService';
import { formatDate } from '../../utils/formatDate';

const ResumeUpload = ({ resume, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      setError('Resume must be a PDF file');
      setFile(null);
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadMyResume(file);
      onUploaded?.(res.data.resume);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resumeUrl = resume?.filePath
    ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${resume.filePath}`
    : null;

  return (
    <div className="space-y-3">
      {resume?.filePath ? (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 border border-gray-200 rounded-md px-3 py-3 hover:border-brand-300"
        >
          <FiFileText className="text-brand-600 shrink-0" size={20} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{resume.fileName}</p>
            <p className="text-xs text-gray-500">Uploaded {formatDate(resume.uploadedAt)}</p>
          </div>
        </a>
      ) : (
        <p className="text-sm text-gray-500">No resume uploaded yet.</p>
      )}

      <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-md px-3 py-3 text-sm text-gray-500 cursor-pointer hover:border-brand-400">
        <FiUpload />
        {file ? file.name : 'Click to select a new resume (PDF only)'}
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
      </label>
      {error && <p className="form-error">{error}</p>}

      {file && (
        <Button onClick={handleUpload} loading={uploading} size="sm">
          Upload Resume
        </Button>
      )}
    </div>
  );
};

export default ResumeUpload;
