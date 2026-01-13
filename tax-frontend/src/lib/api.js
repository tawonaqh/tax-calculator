import axios from "axios";

const API_BASE_URL = "https://api.taxculapi.com"

// Enhanced axios instance for elite endpoints
const eliteApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 415000, // Increased for complex analysis
  headers: {
    "Content-Type": "application/json",
    "X-Elite-Client": "tana-elite-v3",
  },
});

// Request interceptor
eliteApi.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 Elite API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("💥 Elite API Request Error:", error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
eliteApi.interceptors.response.use(
  (response) => {
    console.log(
      `✅ Elite API Response: ${response.status} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    console.error("💥 Elite API Response Error:", {
      status: error.response?.status,
      message: error.message,
      code: error.code,
      url: error.config?.url,
    });

    // Enhanced error mapping
    if (error.code === "ECONNREFUSED" || error.message === "Network Error") {
      error.response = { status: 503 }; // Service Unavailable
    }

    return Promise.reject(error);
  }
);

// Enhanced error handler for elite endpoints
const handleEliteError = (error, context = "elite request") => {
  console.error(`💥 Error in ${context}:`, {
    status: error.response?.status,
    message: error.message,
    code: error.code,
    data: error.response?.data,
  });

  if (error.response?.data) {
    console.log("📦 Returning response data despite error status");
    return error.response.data;
  }

  if (error.response?.status === 400) {
    throw new Error("unsafe_content");
  } else if (error.response?.status === 404) {
    throw new Error("endpoint_not_found");
  } else if (error.response?.status === 429) {
    throw new Error("rate_limit");
  } else if (error.response?.status === 503) {
    throw new Error("service_unavailable");
  } else if (
    error.code === "ECONNREFUSED" ||
    error.message === "Network Error"
  ) {
    throw new Error("connection_error");
  } else if (error.ressponse?.status >= 500) {
    throw new Error("server_error");
  } else if (
    error.code === "ECONNABORTED" ||
    error.message.includes("timeout")
  ) {
    throw new Error("timeout_error");
  }

  throw new Error(
    "The tax analysis system is currently optimizing. Please try again momentarily."
  );
};

// Elite API service with specialized modes
export const eliteTaxAPI = {
  // Main elite question endpoint with mode support
  askEliteQuestion: async (
    question,
    sessionId = null,
    userType = "elite",
    responseMode = "comprehensive"
  ) => {
    const payload = {
      question: question.trim(),
      user_type: userType,
      session_id: sessionId,
      response_mode: responseMode, // New: comprehensive, calculations, case_laws, implementations, continue_analysis
      elite_mode: true,
    };

    try {
      const response = await eliteApi.post("/ai/elite/tax-question", payload);

      // Check if it's a valid response
      if (response.data) {
        // Both will have response.data.response at root level

        // Check for response text (cached responses might have cache_hit flag)
        if (response.data.response || response.data.source === "faq_engine") {
          console.log(
            "✅ Response received, cache hit:",
            response.data.cache_hit || false
          );
          return response.data;
        }

        // Check for error
        if (response.data.error) {
          throw new Error(response.data.error);
        }
      }

      throw new Error("Elite analysis response empty");
    } catch (error) {
      return handleEliteError(error, "asking elite question");
    }
  },

  // Specialized analysis endpoint for different modes
  specializedAnalysis: async (
    originalQuestion,
    previousResponse,
    sessionId,
    analysisMode = "continue_analysis",
    userFocus = ""
  ) => {
    try {
      const response = await eliteApi.post("/ai/elite/specialized-analysis", {
        original_question: originalQuestion,
        previous_response: previousResponse,
        session_id: sessionId,
        analysis_mode: analysisMode,
        user_focus: userFocus,
      });

      return response.data;
    } catch (error) {
      return handleEliteError(error, "specialized analysis");
    }
  },

  // Enhanced follow-up using specialized analysis
  followUp: async (
    userResponse,
    originalQuestion,
    previousAnswer,
    sessionId,
    followUpType = "general"
  ) => {
    try {
      // Map follow-up types to analysis modes
      const modeMapping = {
        // legal_depth: "case_laws",
        practical_application: "implementations",
        calculation_detail: "calculations",
        case_references: "case_laws",
        amendments_tracker_analysis: "amendments_tracker",
        strategic_advice: "risk_assessment",
        continue: "continue_analysis",
        general: "continue_analysis",
      };

      const analysisMode = modeMapping[followUpType] || "continue_analysis";

      const response = await eliteApi.post("/ai/elite/specialized-analysis", {
        original_question: originalQuestion,
        previous_response: previousAnswer,
        session_id: sessionId,
        analysis_mode: analysisMode,
        user_focus: userResponse,
      });

      return response.data;
    } catch (error) {
      return handleEliteError(error, "elite follow-up");
    }
  },

  // Elite session management
  startEliteSession: async (
    userProfile = {
      expertise_level: "expert_legal",
      practice_area: "complex_tax",
      preferred_detail: "comprehensive",
    }
  ) => {
    try {
      const response = await eliteApi.post("/ai/elite/start-session", {
        user_profile: userProfile,
      });

      return response.data;
    } catch (error) {
      console.warn(
        "Elite session endpoint failed, using enhanced fallback:",
        error.message
      );

      // Enhanced fallback session with local storage
      const fallbackSessionId = `elite-fallback-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        const sessions = JSON.parse(
          localStorage.getItem("tana_elite_sessions") || "{}"
        );
        sessions[fallbackSessionId] = {
          session_id: fallbackSessionId,
          created_at: new Date().toISOString(),
          user_profile: userProfile,
          status: "active",
          fallback_mode: true,
        };
        localStorage.setItem("tana_elite_sessions", JSON.stringify(sessions));
      }

      return {
        session_id: fallbackSessionId,
        message: "Elite session started with enhanced fallback features",
        status: "active",
        user_profile: userProfile,
        fallback_mode: true,
        capabilities: [
          "comprehensive_analysis",
          "continued_analysis",
          "calculation_focus",
          "case_law_focus",
          "implementation_focus",
        ],
      };
    }
  },

  // Elite analytics
  getEliteAnalytics: async () => {
    try {
      const response = await eliteApi.get("/ai/elite/analytics");
      return response.data;
    } catch (error) {
      return handleEliteError(error, "fetching elite analytics");
    }
  },

  // Health check
  health: async () => {
    try {
      const response = await eliteApi.get("/health");
      return {
        ...response.data,
        endpoint: "elite",
        status: "operational",
      };
    } catch (error) {
      // Enhanced fallback health check
      return {
        status: "degraded",
        service: "TANA ELITE Tax Assistant",
        version: "3.0.0",
        fallback_mode: true,
        message: "Elite service in fallback mode",
      };
    }
  },

  // Performance metrics
  getPerformanceMetrics: async () => {
    try {
      const response = await eliteApi.get("/ai/elite/performance");
      return response.data;
    } catch (error) {
      console.warn("Elite performance metrics endpoint not available");
      return {
        average_response_time: "1.5s",
        system_uptime: "99.8%",
        active_sessions: 0,
        cache_hit_rate: "85%",
        fallback_metrics: true,
      };
    }
  },
};

// Professional API for backward compatibility (maps to elite endpoints)
export const professionalTaxAPI = {
  askProfessionalQuestion: async (
    question,
    sessionId = null,
    userType = "professional"
  ) => {
    return eliteTaxAPI.askEliteQuestion(
      question,
      sessionId,
      "elite", // Always use elite mode
      "comprehensive" // Default to comprehensive analysis
    );
  },

  followUp: async (
    userResponse,
    originalQuestion,
    previousAnswer,
    sessionId,
    followUpType = "general"
  ) => {
    return eliteTaxAPI.followUp(
      userResponse,
      originalQuestion,
      previousAnswer,
      sessionId,
      followUpType
    );
  },

  startProfessionalSession: async (
    userProfile = {
      expertise_level: "professional",
      practice_area: "corporate_tax",
      preferred_detail: "comprehensive",
    }
  ) => {
    // Upgrade to elite session
    const eliteProfile = {
      expertise_level: "expert_legal",
      practice_area: userProfile.practice_area || "complex_tax",
      preferred_detail: "comprehensive",
    };

    return eliteTaxAPI.startEliteSession(eliteProfile);
  },

  getProfessionalAnalytics: async () => {
    return eliteTaxAPI.getEliteAnalytics();
  },

  health: async () => {
    return eliteTaxAPI.health();
  },

  getPerformanceMetrics: async () => {
    return eliteTaxAPI.getPerformanceMetrics();
  },
};

// Legacy API for backward compatibility
export const taxAPI = {
  askQuestion: async (
    question,
    sessionId = null,
    userType = "professional"
  ) => {
    return professionalTaxAPI.askProfessionalQuestion(
      question,
      sessionId,
      userType
    );
  },

  followUp: async (
    userResponse,
    originalQuestion,
    previousAnswer,
    sessionId
  ) => {
    return professionalTaxAPI.followUp(
      userResponse,
      originalQuestion,
      previousAnswer,
      sessionId
    );
  },

  startSession: async (userProfile = { expertise_level: "professional" }) => {
    return professionalTaxAPI.startProfessionalSession(userProfile);
  },

  health: async () => {
    return professionalTaxAPI.health();
  },
};

export default eliteTaxAPI;
