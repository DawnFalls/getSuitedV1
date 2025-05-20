/**
 * 📝 EvaluationPage Component
 *
 * Displays a detailed summary of an AI interview (both behavioral and technical).
 * - Shows per-question results with code answers, feedback, and body language metrics.
 * - Builds and exports a downloadable PDF report via jsPDF.
 * - Automatically uploads the PDF to the backend (if user is authenticated).
 * - Allows sending the report via email.
 *
 * 📦 Key Features:
 * - Works for both behavioral and technical interviews
 * - Uses `jsPDF` to generate downloadable documents
 * - Authenticates users and saves results for later reuse
 */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import { jsPDF } from 'jspdf';
import './EvaluationPage.css';

/** Structure of a single evaluation entry (either behavioral or technical) */
interface EvaluationResult {
  question: string;
  audioBlob?: Blob;
  transcript?: string;
  confidence?: number;
  toneConfidence?: number;
  bodyLanguage?: {
    smilingScore: number;
    eyeContact: boolean; // still part of type, but not rendered
    emotion: string;
  };
  codeAnswer?: string;
  codeScore?: number;
  feedback?: string;
}

interface UserData {
  email: string;
  name: string;
  profilePicture?: string;
}

const EvaluationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [pdfSaved, setPdfSaved] = useState(false);

  const results = (location.state as { results: EvaluationResult[] })?.results;

  /* ------------------------------------------------------------------
   *  Helper — build jsPDF document (single source of truth)
   * ------------------------------------------------------------------ */
  const buildPdfDoc = () => {
    const doc = new jsPDF();

    try {
      const logo = require('../../../assets/logo.png');
      doc.addImage(logo, 'PNG', 20, 10, 50, 20);
    } catch {}

    doc.setFontSize(16);
    doc.text('Interview Evaluation', 20, 40);

    let y = 50;
    results.forEach((r, idx) => {
      doc.setFontSize(14);
      doc.text(`Question ${idx + 1}:`, 20, y);
      y += 10;

      doc.setFontSize(12);
      const qLines = doc.splitTextToSize(r.question, 180);
      doc.text(qLines, 20, y);
      y += qLines.length * 7;

      /* ---------- Technical ---------- */
      if (r.codeAnswer) {
        doc.setFontSize(14);
        doc.text('Technical Response', 20, y);
        y += 10;
        doc.setFontSize(12);

        const ansLines = doc.splitTextToSize(r.codeAnswer, 180);
        doc.text(ansLines, 20, y);
        y += ansLines.length * 7;

        doc.text(`Code Score: ${r.codeScore ?? 0}/100`, 20, y);
        y += 10;

        if (r.feedback) {
          const fbLines = doc.splitTextToSize(r.feedback, 180);
          doc.text(fbLines, 20, y);
          y += fbLines.length * 7;
        }
      }

      /* ---------- Behavioral ---------- */
      if (r.transcript) {
        doc.setFontSize(14);
        doc.text('Behavioral Response', 20, y);
        y += 10;

        doc.setFontSize(12);
        const trLines = doc.splitTextToSize(r.transcript, 180);
        doc.text(trLines, 20, y);
        y += trLines.length * 7;

        doc.text(`Facial Confidence: ${(r.confidence! * 100).toFixed(2)}%`, 20, y);
        y += 10;

        if (r.toneConfidence !== undefined) {
          doc.text(`Tone Confidence: ${(r.toneConfidence * 100).toFixed(2)}%`, 20, y);
          y += 10;
        }

        if (r.bodyLanguage) {
          doc.text(`Emotion: ${r.bodyLanguage.emotion}`, 20, y);
          y += 10;
          doc.text(`Smiling: ${(r.bodyLanguage.smilingScore * 100).toFixed(1)}%`, 20, y);
          y += 10;

          if (r.toneConfidence !== undefined && r.confidence !== undefined) {
            doc.text(`Overall Confidence: ${(((r.toneConfidence + r.confidence) / 2) * 100).toFixed(2)}%`, 20, y);
            y += 10;
          }
        }
      }

      y += 20;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    return doc;
  };

  const pdfBlob = () => buildPdfDoc().output('blob');
  const downloadPdf = () => buildPdfDoc().save('interview_evaluation.pdf');

  /* ------------------------------------------------------------------
   *  Auth + upload
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5001/auth/verify', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUser({
          email: data.decoded.email,
          name: data.decoded.name,
          profilePicture: data.decoded.profilePicture,
        });
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      });
  }, [navigate]);

  useEffect(() => {
    let didRun = false;
  
    if (user && !pdfSaved && !didRun) {
      didRun = true;
  
      const save = async () => {
        const blob = pdfBlob();
        const form = new FormData();
        form.append('file', blob, 'interview_evaluation.pdf');
        form.append('email', user.email);
  
        await fetch('http://localhost:5001/users/upload-evaluation', {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: form,
        });
  
        setPdfSaved(true);
      };
  
      save();
    }
  }, [user, pdfSaved]);
  

  if (!results || !Array.isArray(results)) {
    navigate('/');
    return null;
  }

  const sendEmail = async () => {
    if (!user) return;
    const form = new FormData();
    form.append('file', pdfBlob(), 'interview_evaluation.pdf');
    form.append('email', user.email);

    try {
      const res = await fetch('http://localhost:5001/sendEmail', {
        method: 'POST',
        body: form,
      });
      console.log('Email sent:', await res.json());
    } catch (err) {
      console.error('Email error:', err);
    }
  };

  return (
    <div className="evaluation-page-container">
      <Navbar user={user} />
      <div className="evaluation-content">
        <h1 className="evaluation-title">Interview Evaluation</h1>
        <ul>
          {results.map((r, idx) => (
            <li key={idx} className="evaluation-item">
              <p><strong>Question:</strong> {r.question}</p>
              {r.codeAnswer && (
                <>
                  <h3 className="section-title">Technical Response</h3>
                  <pre className="code-answer">{r.codeAnswer}</pre>
                  <p><strong>Code Score:</strong> {r.codeScore ?? 0}/100</p>
                  {r.feedback && <p><strong>Feedback:</strong> {r.feedback}</p>}
                </>
              )}
              {r.transcript && (
                <>
                  <h3 className="section-title">Behavioral Response</h3>
                  <p><strong>Transcript:</strong> {r.transcript}</p>
                  <p><strong>Facial Confidence:</strong> {(r.confidence! * 100).toFixed(2)}%</p>
                  {r.toneConfidence !== undefined && (
                    <p><strong>Tone Confidence:</strong> {(r.toneConfidence * 100).toFixed(2)}%</p>
                  )}
                  {r.bodyLanguage && (
                    <>
                      <p><strong>Emotion:</strong> {r.bodyLanguage.emotion}</p>
                      <p><strong>Smiling:</strong> {(r.bodyLanguage.smilingScore * 100).toFixed(1)}%</p>
                      {r.toneConfidence !== undefined && r.confidence !== undefined && (
                        <p><strong>Overall Confidence:</strong> {(((r.toneConfidence + r.confidence) / 2) * 100).toFixed(2)}%</p>
                      )}
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="evaluation-buttons">
          <button className="generate-pdf-btn" onClick={downloadPdf}>Download PDF</button>
          <button className="send-email-btn" onClick={sendEmail}>Send via Email</button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;
