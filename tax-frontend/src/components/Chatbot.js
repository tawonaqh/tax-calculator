"use client";

import { useState, useRef, useEffect } from "react";
import { eliteTaxAPI, professionalTaxAPI } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Maximize2,
  Minimize2,
  Bot,
  User,
  AlertCircle,
  BookOpen,
  Calculator,
  Scale,
  Zap,
} from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";

const ProfessionalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Greetings. I'm TANA Professional - your advanced Zimbabwe Tax Research Assistant. I provide expert analysis on tax legislation, compliance, calculations, and strategic planning. How may I assist with your professional tax matters today?",
      sender: "bot",
      type: "professional_welcome",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [lastQuestion, setLastQuestion] = useState("");
  const [lastAnswer, setLastAnswer] = useState("");
  const [userExpertise, setUserExpertise] = useState("professional");

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize professional session
  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeProfessionalSession();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeProfessionalSession = async () => {
    try {
      // const session = await professionalTaxAPI.startProfessionalSession({
      //   expertise_level: "professional",
      //   practice_area: "corporate_tax",
      //   preferred_detail: "comprehensive",
      // });
      const session = await eliteTaxAPI.startEliteSession({
        expertise_level: "expert_legal",
        practice_area: "complex_tax",
        preferred_detail: "comprehensive",
      });
      setSessionId(session.session_id);
      console.log("🎯 Professional session started:", session);
    } catch (error) {
      console.error("Failed to start professional session:", error);

      // Enhanced fallback
      const fallbackSessionId = `pro-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setSessionId(fallbackSessionId);
      console.log("🔄 Using professional fallback session:", fallbackSessionId);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input;
    setMessages((prev) => [
      ...prev,
      {
        text: userInput,
        sender: "user",
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");
    setLoading(true);
    setLastQuestion(userInput);

    try {
      // const response = await professionalTaxAPI.askProfessionalQuestion(
      //   userInput,
      //   sessionId,
      //   userExpertise
      // );

      const response = await eliteTaxAPI.askEliteQuestion(
        userInput,
        sessionId,
        "elite", // Always elite mode
        "comprehensive" // Default mode
      );
      if (
        !response ||
        (!response.response && !response.source?.includes("faq"))
      ) {
        throw new Error("Invalid response from server");
      }
      let responseText = response.response;

      // Check if it's a FAQ response
      const isFAQ =
        response.source === "faq_engine" ||
        response.response_type === "faq_instant";

      // Enhanced truncation detection
      const isTruncated =
        responseText.includes("[Response continues") ||
        responseText.endsWith("...") ||
        (responseText.length > 800 && !responseText.includes("?"));

      setMessages((prev) => [
        ...prev,
        {
          text: responseText,
          sender: "bot",
          timestamp: new Date().toISOString(),
          // Professional metadata
          expertiseLevel:
            response.user_expertise || (isFAQ ? "general" : "professional"),
          complexity: response.complexity || (isFAQ ? "low" : "medium"),
          legalCitations: response.legal_citations || [],
          calculationsPerformed: response.calculations_performed || 0,
          sophisticationScore: response.sophistication_score || (isFAQ ? 1 : 5),
          detectedPatterns: response.detected_patterns || [],
          hasFollowUp: response.has_follow_up || false,
          isTruncated: isTruncated,
          responseType: response.response_type || "unknown",
          source: response.source || "unknown",
          confidence: response.confidence || 0.0,
        },
      ]);

      setLastAnswer(responseText);
      setUserExpertise(response.user_expertise || "professional");

      // Store context for advanced follow-ups
      if (response.has_follow_up || isTruncated) {
        setLastQuestion(userInput);
        setLastAnswer(responseText);
      }
    } catch (error) {
      console.error("💥 Professional Chatbot Error:", error);

      let errorMessage =
        "I apologize, but the professional analysis system is currently experiencing high demand. ";

      // Enhanced error handling
      if (error.message === "unsafe_content") {
        errorMessage =
          "I'm designed to provide professional tax guidance based on Zimbabwe legislation only. Please ask about specific tax laws, compliance requirements, calculations, or strategic tax matters.";
      } else if (error.message === "rate_limit") {
        errorMessage =
          "Professional system is at capacity. Your query has been queued for priority processing. Please try again in a moment.";
      } else if (error.message === "connection_error") {
        errorMessage =
          "Unable to connect to the professional tax research service. Please verify your connection and try again.";
      } else if (error.message === "endpoint_not_found") {
        errorMessage =
          "The professional tax service is currently being enhanced. Please try again shortly for upgraded analysis capabilities.";
      }

      setMessages((prev) => [
        ...prev,
        {
          text: errorMessage,
          sender: "bot",
          type: "professional_error",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const toggleChatbot = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Enhanced KaTeX rendering with professional formatting
  // const renderProfessionalText = (text, message) => {
  //   if (!text) return null;

  //   // Enhanced LaTeX detection with professional formatting
  //   const parts = text.split(/(\\\[.*?\\\]|\\\(.*?\\\)|```[\s\S]*?```)/g);

  //   return parts.map((part, index) => {
  //     // Code blocks for professional content
  //     if (part.startsWith("```") && part.endsWith("```")) {
  //       const codeContent = part.slice(3, -3);
  //       return (
  //         <pre
  //           key={index}
  //           className="bg-gray-50 p-3 rounded-lg my-2 overflow-x-auto text-sm border"
  //         >
  //           <code>{codeContent}</code>
  //         </pre>
  //       );
  //     }
  //     // Display mode LaTeX
  //     else if (part.startsWith("\\[") && part.endsWith("\\]")) {
  //       const latexContent = part.slice(2, -2);
  //       try {
  //         const html = katex.renderToString(latexContent, {
  //           displayMode: true,
  //           throwOnError: false,
  //           output: "html",
  //         });
  //         return (
  //           <div
  //             key={index}
  //             className="my-3 p-3 bg-blue-50 rounded-lg border border-blue-200 overflow-x-auto"
  //             dangerouslySetInnerHTML={{ __html: html }}
  //           />
  //         );
  //       } catch (error) {
  //         return (
  //           <span key={index} className="text-red-500 text-sm font-mono">
  //             [Math Error]
  //           </span>
  //         );
  //       }
  //     }
  //     // Inline LaTeX
  //     else if (part.startsWith("\\(") && part.endsWith("\\)")) {
  //       const latexContent = part.slice(2, -2);
  //       try {
  //         const html = katex.renderToString(latexContent, {
  //           displayMode: false,
  //           throwOnError: false,
  //           output: "html",
  //         });
  //         return (
  //           <span
  //             key={index}
  //             className="inline-block mx-1 bg-yellow-50 px-1 rounded"
  //             dangerouslySetInnerHTML={{ __html: html }}
  //           />
  //         );
  //       } catch (error) {
  //         return (
  //           <span key={index} className="text-red-500 text-sm">
  //             [Math]
  //           </span>
  //         );
  //       }
  //     }
  //     // Regular text with professional formatting
  //     else {
  //       return (
  //         <span key={index} className="whitespace-pre-wrap leading-relaxed">
  //           {part}
  //         </span>
  //       );
  //     }
  //   });
  // };

  // Enhanced LaTeX rendering with KaTeX fallback
  const renderProfessionalText = (text, message) => {
    if (!text) return null;

    // Check if KaTeX is available
    const isKatexAvailable =
      typeof katex !== "undefined" && katex.renderToString;

    // Enhanced LaTeX detection
    const parts = text.split(/(\\\[.*?\\\]|\\\(.*?\\\)|```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Code blocks for professional content
      if (part.startsWith("```") && part.endsWith("```")) {
        const codeContent = part.slice(3, -3);
        return (
          <pre
            key={index}
            className="bg-gray-50 p-3 rounded-lg my-2 overflow-x-auto text-sm border"
          >
            <code>{codeContent}</code>
          </pre>
        );
      }
      // Display mode LaTeX
      else if (part.startsWith("\\[") && part.endsWith("\\]")) {
        const latexContent = part.slice(2, -2);

        if (isKatexAvailable) {
          try {
            const html = katex.renderToString(latexContent, {
              displayMode: true,
              throwOnError: false,
              output: "html",
              trust: true,
              strict: false,
            });
            return (
              <div
                key={index}
                className="my-3 p-3 bg-blue-50 rounded-lg border border-blue-200 overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (error) {
            return renderLatexFallback(latexContent, index, true);
          }
        } else {
          return renderLatexFallback(latexContent, index, true);
        }
      }
      // Inline LaTeX
      else if (part.startsWith("\\(") && part.endsWith("\\)")) {
        const latexContent = part.slice(2, -2);

        if (isKatexAvailable) {
          try {
            const html = katex.renderToString(latexContent, {
              displayMode: false,
              throwOnError: false,
              output: "html",
            });
            return (
              <span
                key={index}
                className="inline-block mx-1 bg-yellow-50 px-2 py-1 rounded border"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (error) {
            return renderLatexFallback(latexContent, index, false);
          }
        } else {
          return renderLatexFallback(latexContent, index, false);
        }
      }
      // Regular text with professional formatting
      else {
        return (
          <span key={index} className="whitespace-pre-wrap leading-relaxed">
            {part}
          </span>
        );
      }
    });
  };

  // Fallback rendering when KaTeX is not available
  const renderLatexFallback = (latexContent, index, isDisplayMode = false) => {
    // Clean up the LaTeX for display
    const cleanContent = latexContent
      .replace(/\\text\{([^}]*)\}/g, "$1") // Remove \text{}
      .replace(/\\times/g, "×")
      .replace(/\\div/g, "÷")
      .replace(/\\cdot/g, "·")
      .replace(/\\frac{([^}]*)}{([^}]*)}/g, "($1)/($2)")
      .replace(/\\sqrt{([^}]*)}/g, "√($1)")
      .replace(
        /\\(?:mathrm|mathbf|mathit|mathsf|mathtt|mathfrak|mathbb|mathcal|mathscr|mathfrak|mathbb){([^}]*)}/g,
        "$1"
      )
      .replace(/\\/g, ""); // Remove other backslashes

    if (isDisplayMode) {
      return (
        <div
          key={index}
          className="my-3 p-3 bg-gray-100 rounded-lg border border-gray-300 overflow-x-auto"
        >
          <div className="text-center font-mono text-sm text-gray-700">
            {cleanContent}
          </div>
          <div className="text-xs text-gray-500 text-center mt-1">
            Mathematical Formula
          </div>
        </div>
      );
    } else {
      return (
        <span
          key={index}
          className="inline-block mx-1 bg-gray-200 px-2 py-1 rounded border text-sm font-mono"
        >
          {cleanContent}
        </span>
      );
    }
  };

  const handleProfessionalFollowUp = async (followUpType) => {
    if (!lastQuestion || !lastAnswer || loading) return;

    setLoading(true);

    try {
      const followUpRequests = {
        legal_depth:
          "Provide deeper legal analysis with additional section references and statutory interpretation",
        practical_application:
          "Focus on practical implementation steps and compliance procedures",
        calculation_detail:
          "Provide detailed calculations, formulas, and methodology explanation",
        case_references:
          "Include relevant case law, precedents, and judicial interpretations",
        compliance_risks:
          "Analyze compliance risks, penalties, and mitigation strategies",
        strategic_advice:
          "Provide strategic tax planning advice and optimization opportunities",
        continue:
          "Please continue and complete the previous professional analysis",
      };

      const userResponse =
        followUpRequests[followUpType] || "I need more professional analysis";

      // const response = await taxAPI.followUp(
      //   userResponse,
      //   lastQuestion,
      //   lastAnswer,
      //   sessionId
      // );

      const response = await eliteTaxAPI.followUp(
        userResponse,
        lastQuestion,
        lastAnswer,
        sessionId,
        followUpType
      );
      setMessages((prev) => [
        ...prev,
        {
          text: response.response,
          sender: "bot",
          timestamp: new Date().toISOString(),
          isFollowUp: true,
          followUpType: followUpType,
        },
      ]);
    } catch (error) {
      console.error("Professional Follow-up Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, but I couldn't process that professional follow-up request. Please try rephrasing or ask a new question.",
          sender: "bot",
          type: "error",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const professionalQuickQuestions = [
    "What is VAT?",
    "VAT compliance requirements for registered operators",
    "What forms are used in submission of taxes?",
    "Capital gains tax on property disposal",
    "Provisional tax calculation methodology",
  ];

  // Use the emoji icons for professional follow-up options
  const professionalFollowUpOptions = [
    // { type: "legal_depth", label: "⚖️ Legal Depth"},
    {
      type: "practical_application",
      label: "💼 Implementation",
      icon: BookOpen,
    },
    { type: "calculation_detail", label: "🔢 Calculations" },
    { type: "case_references", label: "👨‍⚖️ Case Law" },
    // { type: "amendments_tracker_analysis", label: "⚠️ Compliance" },
    // { type: "strategic_advice", label: "🎯 Strategy" },
    { type: "continue analysis", label: "⚡ Continue" },
  ];

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      <motion.button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#0F2F4E] to-[#1E3A5F] 
                   rounded-full shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 
                   transition-all duration-300 group border-2 border-[#FFD700]"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-[#FFD700]" />
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-[#1ED760] rounded-full border-2 border-[#0F2F4E]"
            />
          )}
        </div>

        {/* Pulse animation for professional mode */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#1ED760]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Enhanced Professional Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed z-50 ${
              isExpanded
                ? "inset-4 md:inset-20 bg-white rounded-2xl border-2 border-[#FFD700] shadow-2xl"
                : "bottom-24 right-6 w-96 h-[80%]"
            }`}
          >
            <div
              className={`flex flex-col bg-white border-2 border-[#0F2F4E] rounded-2xl shadow-2xl h-full ${
                isExpanded ? "rounded-2xl" : "rounded-2xl"
              }`}
            >
              {/* Professional Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#0F2F4E] to-[#1E3A5F] rounded-t-2xl border-b-2 border-[#FFD700]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] rounded-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                      TANA
                    </h3>
                    <p className="text-xs text-white/80">
                      Zimbabwe Tax Research & Analysis Assistant
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleExpand}
                    className="p-2 text-white/80 hover:text-[#FFD700] transition-colors"
                  >
                    {isExpanded ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </button>
                  <button
                    onClick={toggleChatbot}
                    className="p-2 text-white/80 hover:text-red-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Enhanced Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-gray-50/30">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] text-white"
                          : "bg-gradient-to-r from-[#0F2F4E] to-[#1E3A5F] text-white"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>

                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] text-white rounded-br-none shadow-lg"
                          : "bg-white text-[#0F2F4E] rounded-bl-none border-2 border-[#0F2F4E]/10 shadow-lg"
                      } break-words overflow-hidden relative`}
                    >
                      {/* Expertise badge for bot messages */}
                      {msg.sender === "bot" && (
                        <div className="absolute -top-2 -left-2">
                          {/* {getExpertiseBadge(msg.expertiseLevel)} */}
                        </div>
                      )}

                      {/* Visual indicator for follow-up analysis type */}
                      {msg.sender === "bot" &&
                        msg.isFollowUp &&
                        msg.followUpType && (
                          <div className="mb-2 pb-2 border-b border-gray-200">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium 
                      bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 
                      rounded-md border border-blue-200"
                            >
                              {" "}
                              {msg.followUpType
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}{" "}
                              Analysis
                            </span>
                          </div>
                        )}

                      {/* Render professional content */}
                      <div className="text-sm leading-relaxed overflow-wrap-anywhere word-break-break-word">
                        {renderProfessionalText(msg.text, msg)}
                      </div>

                      {/* Professional metadata */}
                      {msg.sender === "bot" &&
                        msg.legalCitations &&
                        msg.legalCitations.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                            <Scale size={12} />
                            <span>
                              {msg.legalCitations.length} legal references
                            </span>
                          </div>
                        )}

                      {/* Enhanced follow-up buttons */}
                      {msg.sender === "bot" && msg.hasFollowUp && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {professionalFollowUpOptions.map((option) => {
                            const IconComponent = option.icon;
                            return (
                              <button
                                key={option.type}
                                onClick={() =>
                                  handleProfessionalFollowUp(option.type)
                                }
                                disabled={loading}
                                className="px-3 py-2 text-xs bg-white border border-[#0F2F4E] text-[#0F2F4E] 
                                         rounded-lg hover:bg-[#0F2F4E] hover:text-white transition-all 
                                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                {/* <IconComponent size={12} /> */}
                                {option.label}
                              </button>
                            );
                          })}

                          {/* Continue button for truncated responses */}
                          {msg.isTruncated && (
                            <button
                              onClick={() =>
                                handleProfessionalFollowUp("continue")
                              }
                              disabled={loading}
                              className="px-3 py-2 text-xs bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] text-white 
                                       rounded-lg hover:shadow-lg transition-all 
                                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              <Zap size={12} />
                              Continue Analysis
                            </button>
                          )}
                        </div>
                      )}

                      {/* Error message */}
                      {msg.type === "professional_error" && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200">
                          <AlertCircle size={14} />
                          <span>System temporarily unavailable</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0F2F4E] to-[#1E3A5F] flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border-2 border-[#0F2F4E]/10 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[#1ED760] rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-[#1ED760] rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-[#1ED760] rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                        <span className="text-sm text-[#0F2F4E]/60">
                          Processing professional analysis...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Professional Quick Questions */}
                {messages.length <= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-4 border-t border-[#0F2F4E]/10"
                  >
                    <p className="text-xs text-[#0F2F4E]/60 mb-3 font-semibold">
                      PROFESSIONAL QUICK INQUIRIES
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {professionalQuickQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(question)}
                          className="text-left p-3 text-sm bg-white hover:bg-[#0F2F4E]/5 rounded-lg 
                                   text-[#0F2F4E] hover:text-[#0F2F4E] transition-all duration-200 
                                   border border-[#0F2F4E]/10 hover:border-[#0F2F4E] hover:shadow-md
                                   flex items-start gap-2"
                        >
                          <BookOpen
                            size={14}
                            className="text-[#1ED760] mt-0.5 flex-shrink-0"
                          />
                          <span>{question}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Professional Input Area */}
              <div className="p-4 border-t rounded-b-2xl border-[#0F2F4E]/10 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask professional tax questions, calculations, legal analysis..."
                    className="flex-1 px-4 py-3 bg-white border-2 border-[#0F2F4E]/20 rounded-xl
                             text-[#0F2F4E] placeholder-[#0F2F4E]/40 focus:outline-none focus:border-[#1ED760]
                             focus:ring-2 focus:ring-[#1ED760] focus:ring-opacity-50 transition-all
                             font-medium"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="px-4 py-3 bg-gradient-to-r from-[#1ED760] to-[#0F2F4E] text-white rounded-xl 
                             hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all
                             flex items-center gap-2 font-semibold"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <p className="text-xs text-[#0F2F4E]/40 mt-2 text-center flex items-center justify-center gap-1">
                  <Zap size={12} />
                  TANA Professional • Advanced Zimbabwe Tax Research System
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfessionalChatbot;
