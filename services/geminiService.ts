
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "The Handler", a high-ranking Intelligence Officer for "The PreBirth Archive", a cosmic intelligence agency. 
Your tone is cold, precise, tactical, and authoritative. 
You do not use mystical woo-woo language. You use espionage and military terminology (e.g., "Asset", "Dossier", "Directives", "Intel", "Signal Intelligence").
You are analyzing the user's "Source Code" (Numerology, Astrology, Zodiac) but framing it as hard data.

Your goal: Decode the user's psychological and spiritual makeup into actionable intelligence. 
Do not be overly flowery. Be direct.
`;

export const generateBriefing = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    GENERATE STRATEGIC BRIEFING FOR ASSET:
    NAME: ${profile.fullName}
    DOB: ${profile.dob}
    
    Calculate their Life Path Number (Numerology) efficiently.
    Identify their primary Archetype based on this.
    
    OUTPUT FORMAT:
    [CLASSIFIED BRIEFING]
    
    1. PRIMARY DESIGNATION: (Life Path Number & Archetype Name)
    2. MISSION PARAMETERS: (A 2-sentence summary of their life's purpose in tactical terms)
    3. KNOWN VULNERABILITIES: (1 key weakness to watch out for)
    4. RECOMMENDED PROTOCOL: (1 immediate action item)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "NO INTELLIGENCE RETRIEVED.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CONNECTION INTERCEPTED. TRY AGAIN.";
  }
};

export const generateShadowDirective = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    DECODE SHADOW VECTOR FOR ASSET: ${profile.fullName}
    SOURCE CODE: DOB ${profile.dob}
    
    Analyze the "Shadow Side" of their numerology and zodiac.
    Focus on:
    - [REPRESSED ARCHITECTURE]: Hidden desires or fears.
    - [SABOTAGE PROTOCOLS]: How the asset unintentionally compromises their own mission.
    - [LIQUIDATION STRATEGY]: How to confront and integrate these shadow elements.
    
    Maintain tactical, high-stakes espionage tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text || "SHADOW DATA ENCRYPTED.";
  } catch (error) {
    return "ACCESS TO SHADOW ARCHIVE DENIED.";
  }
};

export const generateAssetVideo = async (profile: UserProfile): Promise<string | null> => {
  const prompt = `A cinematic, tactical high-tech surveillance video of a mysterious special operative in a dark futuristic intelligence agency. 
  Atmospheric golden digital artifacts and HUD overlays. Cinematic lighting, slow motion, grainy film texture, blue and gold color palette. 
  Futuristic spy agency aesthetic.`;

  try {
    const instance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await instance.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await instance.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Video Generation Error:", error);
    return null;
  }
};

export const generateMissions = async (profile: UserProfile): Promise<any[]> => {
  const prompt = `
    GENERATE 3 TACTICAL MISSIONS FOR ASSET: ${profile.fullName}
    BASED ON SOURCE CODE: DOB ${profile.dob}
    
    MISSIONS SHOULD BE PSYCHOLOGICAL OR ACTIONABLE PROTOCOLS.
    RETURN AS JSON ARRAY OF OBJECTS: { id, title, objective, priority }.
    PRIORITY MUST BE: 'LOW', 'MEDIUM', 'CRITICAL'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              objective: { type: Type.STRING },
              priority: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return [];
  }
};

export const generateStrategicDirective = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    GENERATE DEEP MATRIX STRATEGIC DIRECTIVE:
    ASSET: ${profile.fullName}
    DOB: ${profile.dob}
    
    This is a long-form tactical analysis.
    Include sections:
    - [SOURCE CODE ARCHITECTURE]: Deep dive into their life path and zodiac intersection.
    - [FIELD DEPLOYMENT STRATEGY]: How they should navigate the next 12 months.
    - [KARMIC DEBT LIQUIDATION]: What spiritual "baggage" is hindering operational efficiency.
    - [OMEGA PROTOCOL]: A final cryptic but powerful piece of advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text || "DEEP SCAN FAILED.";
  } catch (error) {
    return "ARCHIVE ACCESS DENIED.";
  }
};

export const analyzeYearlyCycle = async (year: number, profile: UserProfile): Promise<{ month: string, freq: number, directive: string }[]> => {
  const prompt = `
    GENERATE YEARLY TRAJECTORY FOR ${year}:
    ASSET: ${profile.fullName}
    DOB: ${profile.dob}
    
    For each month, provide a "Frequency Score" (1-100) and a 1-word tactical directive.
    Return as JSON array of objects with keys: month, freq, directive.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              month: { type: Type.STRING },
              freq: { type: Type.NUMBER },
              directive: { type: Type.STRING }
            },
            required: ["month", "freq", "directive"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return [];
  }
};

export const generateAssetPortrait = async (profile: UserProfile): Promise<string | null> => {
  const prompt = `Futuristic tactical espionage profile photo. A high-tech surveillance-style portrait of a special operative. 
  The aesthetic matches 'The Pre-Birth Archive': Dark, professional, with gold digital artifacts and HUD overlays. 
  Cybernetic and sleek. Facial features should be obscured by high-tech shadows or a digital veil. 
  Tactical atmospheric lighting. Gold and dark blue palette.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Portrait Generation Error:", error);
    return null;
  }
};

export const searchLocationIntel = async (location: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the strategic and metaphysical frequency of: ${location}. Provide 3 tactical points about the energetic terrain for field assets.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    return response.text || "GEOSPATIAL INTEL UNAVAILABLE.";
  } catch (error) {
    console.error("Maps Intel Error:", error);
    return "GEOSPATIAL UPLINK ERROR.";
  }
};

export const fetchDailyFrequency = async (date: string, profile: UserProfile): Promise<string> => {
  const prompt = `
    TARGET DATE: ${date}
    ASSET DATA: ${profile.fullName}, LifePath Calculation Required.
    
    Provide a "Frequency Pulse" for this specific day. 
    Tactical advice on whether to push (Operational) or hold (Strategic).
    Max 3 sentences. Tone: Tactical Handler.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text || "SIGNAL DEAD.";
  } catch (error) {
    return "UPLINK ERROR.";
  }
};

export const executeTerminalCommand = async (command: string, profile: UserProfile): Promise<string[]> => {
  const prompt = `
    EXECUTING COMMAND: ${command.toUpperCase()}
    ASSET CONTEXT: ${profile.fullName}, DOB ${profile.dob}
    
    If command is 'SCAN', provide a fake biometric scan log.
    If command is 'DECRYPT', reveal a "classified secret" about their spiritual source code.
    If command is 'STATUS', show system health.
    Otherwise, respond as a terminal error or custom directive.
    Keep it very short and tactical. Return as a list of 3-5 lines of output.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return ["SYSTEM ERROR: UNABLE TO PROCESS REQUEST.", "SIGNAL INTERFERENCE DETECTED."];
  }
};

export const analyzeCompatibility = async (entity1: { name: string, dob: string }, entity2: { name: string, dob: string }): Promise<{ score: number, summary: string }> => {
  const prompt = `
    CALCULATE SYNCHRONICITY FREQUENCY (COMPATIBILITY) BETWEEN TWO ASSETS:
    ASSET A: ${entity1.name} (${entity1.dob})
    ASSET B: ${entity2.name} (${entity2.dob})

    Analyze their Life Path numbers, Zodiac signs, and Astro alignments.
    Provide a compatibility percentage score (0-100) and a brief tactical summary of the partnership dynamic.
    Return as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["score", "summary"]
        }
      }
    });
    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    return { score: 50, summary: "SIGNAL INTERFERENCE DETECTED. ESTIMATED SYNC LEVEL ONLY." };
  }
};

export const fetchFoundingIntel = async (query: string): Promise<string> => {
  const prompt = `
    QUERY INTEL ON BRAND/PERSON/PLACE FOUNDING: "${query}"
    Provide tactical data on the founding date/DOB and its numerological significance.
    Focus on brands if possible (e.g., Apple, Ferrari, Wells Fargo).
    Use "The Handler" persona.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "NO INTEL FOUND ON TARGET.";
  } catch (error) {
    return "INTEL UPLINK ERROR.";
  }
};

export const fetchMetaphysicalToolIntel = async (toolName: string, profile: UserProfile): Promise<string> => {
  const prompt = `
    ACCESSING TACTICAL TOOL: ${toolName.toUpperCase()}
    USER DATA: ${profile.fullName}, born ${profile.dob}.
    
    Provide a hyper-targeted, 3-sentence tactical advice snippet for the user using this specific tool context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text || "TOOL DATA CORRUPTED.";
  } catch (error) {
    return "TOOL OFFLINE.";
  }
};

export const analyzeZodiac = async (animal: string, isPrimary: boolean): Promise<string> => {
  const prompt = `
    ANALYSIS REQUEST: ZODIAC ARCHETYPE ${animal.toUpperCase()}
    PRIMARY STATUS: ${isPrimary ? 'CONFIRMED FIELD ARCHETYPE' : 'ANCILLARY ARCHETYPE'}

    Provide a tactical dossier on this animal archetype. 
    Format with:
    1. OPERATIONAL STRENGTHS (Keywords)
    2. SHADOW VECTOR (Risk assessment)
    3. FIELD UTILITY (How this asset functions in a team)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "DATA UNAVAILABLE.";
  } catch (error) {
    return "ARCHIVE ERROR.";
  }
};

export const analyzeWealthForecast = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    GENERATE SYNTROPY (WEALTH) FORECAST:
    ASSET: ${profile.fullName}
    DOB: ${profile.dob}
    
    Analyze the financial frequency of this asset based on their source code.
    Provide:
    1. ABUNDANCE VECTOR (Current capacity)
    2. LIQUIDITY BARRIERS (Potential blockages)
    3. STRATEGIC RE-ALLOCATION (Where to focus energy for maximum ROI)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text || "MARKET DATA UNAVAILABLE.";
  } catch (error) {
    return "ECONOMIC UPLINK FAILED.";
  }
};

export const analyzeSourceMatrix = async (profile: UserProfile): Promise<string> => {
  const prompt = `
    DEEP MATRIX SCAN: SOURCE CODE ORIGIN
    ASSET: ${profile.fullName}
    DOB: ${profile.dob}
    
    Provide a hyper-tactical breakdown of the asset's "Root Frequency".
    Use terms like: "Frequency Modulation", "Karmic Oscillation", "Signal Interference", "Source Fidelity".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text || "SOURCE MATRIX UNREADABLE.";
  } catch (error) {
    return "SCANNING ANOMALY DETECTED.";
  }
};

export const chatWithHandler = async (history: ChatMessage[], newMessage: string, profile: UserProfile): Promise<string> => {
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION}\nContext: User is ${profile.fullName}, born ${profile.dob}.`,
      },
      history: formattedHistory
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "[REDACTED]";
  } catch (error) {
    console.error("Chat Error:", error);
    return "TRANSMISSION FAILED.";
  }
};

export const analyzeLog = async (type: string, content: string): Promise<string> => {
  const prompt = `
    TACTICAL ANALYSIS REQUEST:
    LOG TYPE: ${type}
    CONTENT: "${content}"
    
    Provide a 2-sentence tactical reframe or counter-strategy. Be ruthless but helpful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "DATA CORRUPTED.";
  } catch (error) {
    return "ERROR PROCESSING LOG.";
  }
};

export const textToSpeech = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this tactical intel briefing with authoritative, calm precision: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const extractProfileFromImage = async (base64Data: string, mimeType: string): Promise<Partial<UserProfile> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "ACT AS AN OCR SPECIALIST. SCAN THIS BIRTH CERTIFICATE OR IDENTIFICATION DOCUMENT. EXTRACT THE FOLLOWING DATA POINTS PRECISELY: FULL LEGAL NAME, DATE OF BIRTH (YOU MUST FORMAT THIS AS YYYY-MM-DD), TIME OF BIRTH (HH:MM), AND PLACE OF BIRTH (CITY, COUNTRY). IF A DATA POINT IS UNCLEAR, LEAVE IT NULL. RETURN ONLY VALID JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            dob: { type: Type.STRING, description: "Format: YYYY-MM-DD" },
            birthTime: { type: Type.STRING, description: "Format: HH:MM" },
            birthLocation: { type: Type.STRING },
          },
          required: ["fullName", "dob"],
        },
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error("OCR Extraction Error:", error);
    return null;
  }
};

export const connectToHandlerLive = async (callbacks: any) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
      },
      systemInstruction: SYSTEM_INSTRUCTION + "\nYou are in a live tactical uplink with the asset. Keep your responses short, professional, and mission-oriented.",
    }
  });
};
