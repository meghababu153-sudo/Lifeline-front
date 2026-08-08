import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PatientLayout from "../../layouts/PatientLayout";
import { Send, Bot, User, Sparkles, AlertTriangle, RotateCcw } from "lucide-react";

// ─── Vitalis AI response engine (demo — no real API) ─────────────────────────

function buildContext(reports, timeline, medications, labTrends) {
  return { reports, timeline, medications, labTrends };
}

function vitalisRespond(userInput, ctx) {
  const q = userInput.toLowerCase();
  const { reports, timeline, medications, labTrends } = ctx;

  // Greet
  if (q.match(/^(hi|hello|hey|good|namaste)/)) {
    return "Hello! I'm Vitalis, your personal health assistant. I can help you understand your medical reports, explain your lab values, summarise your health history, or answer questions about your records.\n\nWhat would you like to know?";
  }

  // Diagnose attempt detection
  if (q.match(/(do i have|am i|have i got|is it cancer|is it serious|will i|could it be)/)) {
    return "I understand your concern, but I'm not able to make diagnoses or assess your condition. Only a qualified physician can evaluate your health in full context.\n\nI can, however, explain what your reports say, or summarise what your doctors have noted. Would you like that?";
  }

  // Summary
  if (q.match(/(summar|overview|overall|health status|how am i|quick summary)/)) {
    const diagnosesAll = new Set();
    reports.forEach((r) => (r.extracted?.diagnoses || []).forEach((d) => diagnosesAll.add(d)));
    const dx = [...diagnosesAll];
    const medNames = [...new Set(medications.map((m) => m.name))];
    const markers = Object.keys(labTrends);
    const abnormal = markers.filter((m) => {
      const last = labTrends[m][labTrends[m].length - 1];
      return last.normal === false;
    });

    let reply = `Here's a summary based on your verified records:\n\n`;
    reply += `📋 **Reports on file:** ${reports.length}\n`;
    if (dx.length > 0) reply += `🩺 **Conditions noted:** ${dx.join(", ")}\n`;
    if (medNames.length > 0) reply += `💊 **Medications:** ${medNames.join(", ")}\n`;
    if (markers.length > 0) reply += `🔬 **Lab markers tracked:** ${markers.length} (${abnormal.length} needing attention)\n`;

    reply += `\n💡 Tip: Ask me to explain any specific report, medication, or lab result!`;
    return reply;
  }

  // Lab values
  if (q.match(/(lab|blood test|hba1c|cholesterol|haemoglobin|vitamin d|glucose|tsh|thyroid|ldl|hdl)/)) {
    const markers = Object.keys(labTrends);
    if (markers.length === 0) return "No lab values have been extracted from your reports yet. Ask your doctor to upload your blood test results.";

    let reply = "Based on your lab reports, here are your recorded values:\n\n";
    markers.forEach((name) => {
      const vals = labTrends[name];
      const latest = vals[vals.length - 1];
      const status = latest.normal ? "✅ Normal" : "⚠️ Needs review";
      reply += `**${name}:** ${latest.value} ${latest.unit} — ${status} (${latest.date})\n`;
    });
    reply += "\n*Always discuss these values with your doctor. I'm presenting information from your reports only.*";
    return reply;
  }

  // Medications
  if (q.match(/(medication|medicine|drug|tablet|pill|metformin|levothyroxine|vitamin d|prescription)/)) {
    if (medications.length === 0) return "No medications have been extracted from your reports yet.";
    const seen = new Set();
    const unique = medications.filter((m) => { if (seen.has(m.name)) return false; seen.add(m.name); return true; });
    let reply = "Here are the medications from your verified reports:\n\n";
    unique.forEach((m) => {
      reply += `💊 **${m.name}** — ${m.dosage}, ${m.frequency}`;
      if (m.duration) reply += ` (${m.duration})`;
      reply += "\n";
    });
    reply += "\n*This is extracted from your official medical reports. Always follow your doctor's specific instructions.*";
    return reply;
  }

  // Reports
  if (q.match(/(report|document|uploaded|record|file)/)) {
    if (reports.length === 0) return "No reports have been uploaded to your account yet. Your doctor will upload reports after your consultation.";
    let reply = `You have ${reports.length} verified report(s) on file:\n\n`;
    reports.forEach((r) => {
      reply += `📄 **${r.fileName.replace(/_/g, " ")}** — ${r.reportType} (${r.extracted?.dates?.reportDate || r.uploadedAt.slice(0, 10)})\n`;
      if (r.summary?.[0]) reply += `   › ${r.summary[0]}\n`;
    });
    return reply;
  }

  // Journey / history
  if (q.match(/(history|journey|timeline|past|when|event)/)) {
    if (timeline.length === 0) return "No timeline events have been recorded yet.";
    const reportEvents = timeline.filter((e) => e.type !== "Diagnosis").slice(0, 5);
    let reply = `Your health journey has ${timeline.length} recorded events. Here are the most recent:\n\n`;
    reportEvents.forEach((e) => {
      reply += `📅 **${e.date}** — ${e.title} (${e.type})\n`;
    });
    return reply;
  }

  // Follow-ups
  if (q.match(/(follow.up|follow up|next|appointment|due|pending)/)) {
    const allFollowUps = [];
    reports.forEach((r) => (r.extracted?.followUps || []).forEach((f) => allFollowUps.push(f)));
    if (allFollowUps.length === 0) return "No pending follow-ups have been extracted from your reports.";
    let reply = "Here are your pending follow-up instructions from your reports:\n\n";
    allFollowUps.forEach((fu, i) => { reply += `${i + 1}. ${fu}\n`; });
    reply += "\n*Check your Care Plan for more details and due dates.*";
    return reply;
  }

  // Explain a specific report
  if (q.match(/(explain|what does|what is|tell me about|understand)/)) {
    const match = reports.find((r) =>
      r.fileName.toLowerCase().includes(q.split(" ").filter((w) => w.length > 4)[0] || "") ||
      r.reportType.toLowerCase().includes(q)
    );
    if (match) {
      let reply = `Here's what your **${match.reportType}** report says:\n\n`;
      (match.summary || []).forEach((s) => { reply += `• ${s}\n`; });
      if (match.extracted?.diagnoses?.length) reply += `\nConditions noted: ${match.extracted.diagnoses.join(", ")}`;
      if (match.extracted?.followUps?.length) reply += `\nFollow-ups: ${match.extracted.followUps.join("; ")}`;
      reply += "\n\n*This is a summary for your understanding. Please consult your doctor for clinical interpretation.*";
      return reply;
    }
  }

  // Allergies
  if (q.match(/(allerg|reaction|intolerant)/)) {
    return "For your allergy information, please visit your Emergency Profile. It lists all known allergies from your records and emergency profile.";
  }

  // Help
  if (q.match(/(help|what can you|what do you|capabilities|features)/)) {
    return `I'm Vitalis, your personal health assistant. Here's what I can help with:\n\n📋 **Summarise your health records**\n🔬 **Explain your lab values**\n💊 **List your medications**\n📄 **Explain specific reports**\n📅 **Review your health timeline**\n📝 **List pending follow-ups**\n\nJust ask in plain language — like "What are my recent lab results?" or "Summarise my health."`;
  }

  // Default
  return `I'm not sure I understood that. Here are some things you can ask me:\n\n• "Summarise my health records"\n• "What are my lab values?"\n• "What medications am I on?"\n• "Explain my blood test report"\n• "What are my pending follow-ups?"\n\nI'm here to help you understand your medical information — but I'm not able to diagnose conditions or replace your doctor.`;
}

// ─── Message rendering ────────────────────────────────────────────────────────

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? "bg-green-600" : "bg-blue-600"
      }`}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? "bg-green-600 text-white rounded-tr-sm"
          : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
      }`}>
        {msg.content}
      </div>
    </div>
  );
}

// ─── Suggested prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "Summarise my health records",
  "What are my lab values?",
  "What medications am I on?",
  "Show my pending follow-ups",
  "Explain my most recent report",
  "What is my health journey?",
];

// ─── Main Page ────────────────────────────────────────────────────────────────

function VitalisPage() {
  const { currentUser } = useAuth();
  const { getVitalisHistory, addVitalisMessage, getPatientReports, getPatientTimeline, getPatientMedications, getPatientLabTrends } = useAppData();

  const history = getVitalisHistory(currentUser.id);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isTyping]);

  const reports = getPatientReports(currentUser.id);
  const timeline = getPatientTimeline(currentUser.id);
  const medications = getPatientMedications(currentUser.id);
  const labTrends = getPatientLabTrends(currentUser.id);
  const ctx = buildContext(reports, timeline, medications, labTrends);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");

    addVitalisMessage(currentUser.id, { role: "user", content: msg });
    setIsTyping(true);

    setTimeout(() => {
      const reply = vitalisRespond(msg, ctx);
      addVitalisMessage(currentUser.id, { role: "assistant", content: reply });
      setIsTyping(false);
    }, 600 + Math.random() * 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PatientLayout>
      <div className="flex flex-col h-screen max-h-screen">

        {/* Header */}
        <div className="p-8 pb-4 border-b bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Sparkles size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Vitalis</h1>
                <p className="text-sm text-slate-500">Your personal health intelligence assistant</p>
              </div>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => {/* clear history via context — omitted for simplicity */}}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition"
              >
                <RotateCcw size={13} /> New conversation
              </button>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4 text-xs text-amber-700">
            <AlertTriangle size={13} className="shrink-0" />
            Vitalis provides information from your records only. It does not diagnose conditions.
            Always consult your doctor for medical decisions.
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50">

          {/* Welcome */}
          {history.length === 0 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={36} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Hello, {currentUser.name.split(" ")[0]}!</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                I'm Vitalis. Ask me anything about your medical records, lab results, medications, or health history.
              </p>

              {/* Suggested prompts */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {history.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts (when conversation started) */}
        {history.length > 0 && history.length < 3 && (
          <div className="px-6 py-3 bg-white border-t flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-700 transition"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="p-4 bg-white border-t shrink-0">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your reports, medications, lab values..."
              rows={1}
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
              style={{ minHeight: "46px" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 text-white rounded-xl px-4 py-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>

      </div>
    </PatientLayout>
  );
}

export default VitalisPage;
