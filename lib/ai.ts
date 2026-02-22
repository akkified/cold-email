import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

export interface GenerateDraftParams {
    profile: any;
    prof: any;
    template: any;
}

export async function generateEmailDraft(params: GenerateDraftParams) {
    const provider = process.env.AI_PROVIDER || "groq";

    if (provider === "openai") {
        return generateWithOpenAI(params);
    } else if (provider === "groq") {
        return generateWithGroq(params);
    } else if (provider === "ollama") {
        return generateWithOllama(params);
    } else {
        return generateWithGemini(params);
    }
}

async function generateWithOllama(params: GenerateDraftParams) {
    const { profile, prof, template } = params;
    const model = process.env.AI_MODEL || "llama3";
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

    const prompt = getPrompt(profile, prof, template);

    try {
        const res = await fetch(ollamaUrl, {
            method: "POST",
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
                format: "json",
                system: "You are a helpful assistant that generates personalized cold emails. Output only JSON."
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Ollama error: ${res.status} ${errorText}`);
        }

        const data = await res.json();
        return JSON.parse(data.response);
    } catch (err: any) {
        console.error("Ollama API Error:", err);
        throw new Error(`Ollama Provider Error: ${err.message || "Unknown error"}`);
    }
}

async function generateWithGroq(params: GenerateDraftParams) {
    const { profile, prof, template } = params;
    const apiKey = process.env.GROQ_API_KEY || "";
    const model = process.env.AI_MODEL || "llama-3.1-8b-instant";

    if (!apiKey) throw new Error("GROQ_API_KEY is missing in .env");

    const groq = new Groq({ apiKey });

    const prompt = getPrompt(profile, prof, template);

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that generates personalized cold emails. Output only JSON." },
                { role: "user", content: prompt }
            ],
            model: model,
            response_format: { type: "json_object" }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (!content) throw new Error("Groq returned an empty response content.");

        return JSON.parse(content);
    } catch (err: any) {
        console.error("Groq API Error:", err);
        throw new Error(`Groq Provider Error: ${err.message || "Unknown error"}`);
    }
}

async function generateWithOpenAI(params: GenerateDraftParams) {
    const { profile, prof, template } = params;
    const apiKey = process.env.OPENAI_API_KEY || "";

    const openai = new OpenAI({ apiKey });

    const prompt = getPrompt(profile, prof, template);

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant that generates personalized cold emails. Output only JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("OpenAI returned an empty response content.");

        return JSON.parse(content);
    } catch (err: any) {
        console.error("OpenAI API Error:", err);
        if (err.status === 429) {
            throw new Error(`OpenAI Quota Exceeded. Please check your billing/credits.`);
        }
        throw new Error(`AI Provider Error: ${err.message || "Unknown error"}`);
    }
}

async function generateWithGemini(params: GenerateDraftParams) {
    const { profile, prof, template } = params;
    const apiKey = process.env.GOOGLE_AI_API_KEY || "";

    if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is missing in .env");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = getPrompt(profile, prof, template);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(text);
    } catch (err: any) {
        console.error("Gemini API Error:", err);
        throw new Error(`Gemini Provider Error: ${err.message || "Unknown error"}`);
    }
}

function getPrompt(profile: any, prof: any, template: any) {
    return `
        You are a student writing a cold email to a professor for a research opportunity.
        
        STUDENT PROFILE:
        Name: ${profile.name}
        School: ${profile.school}
        Grade: ${profile.grade}
        Bio: ${profile.bio}
        Experience: ${profile.experience}

        PROFESSOR DETAILS:
        Name: ${prof.name}
        University: ${prof.university}
        Department: ${prof.department}
        Recent Paper: ${prof.paper_title}
        Paper Summary: ${prof.paper_summary}
        Notes: ${prof.user_notes}

        TEMPLATE:
        Subject Pattern: ${template.subject_template}
        Body Pattern: ${template.body_template}
        Tone: ${template.tone}
        Target Length: ${template.target_length}

        INSTRUCTIONS:
        1. Personalize the email using the student's background and the professor's research.
        2. Specifically mention the paper titled "${prof.paper_title}" and explain why it interests the student based on their experience.
        3. Follow the body pattern but replace [PLACEHOLDERS] with actual content.
        4. Maintain a ${template.tone} tone.
        5. Output ONLY a raw JSON object with "subject" and "body" fields.
    `;
}
