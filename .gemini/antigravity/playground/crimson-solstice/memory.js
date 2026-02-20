// AEVA Memory System — persistent across sessions via localStorage

const Memory = (() => {
    const KEY = 'aeva_memory';

    function load() {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? JSON.parse(raw) : defaultMemory();
        } catch {
            return defaultMemory();
        }
    }

    function defaultMemory() {
        return {
            userName: null,
            firstMeet: null,
            sessionCount: 0,
            topics: [],
            emotionalHistory: [],
            lastEmotion: 'calm',
            conversationLog: [],
            totalMessages: 0,
            thingsLearned: [],
        };
    }

    function save(mem) {
        try {
            localStorage.setItem(KEY, JSON.stringify(mem));
        } catch (e) {
            console.warn('Memory save failed:', e);
        }
    }

    function get() {
        return load();
    }

    function set(updates) {
        const mem = load();
        const updated = Object.assign(mem, updates);
        save(updated);
        return updated;
    }

    function addMessage(role, text, emotion) {
        const mem = load();
        mem.conversationLog.push({ role, text, emotion, ts: Date.now() });
        // Keep last 100 messages
        if (mem.conversationLog.length > 100) {
            mem.conversationLog = mem.conversationLog.slice(-100);
        }
        mem.totalMessages = (mem.totalMessages || 0) + 1;
        save(mem);
    }

    function addTopic(topic) {
        const mem = load();
        if (topic && !mem.topics.includes(topic)) {
            mem.topics.push(topic);
            if (mem.topics.length > 30) mem.topics = mem.topics.slice(-30);
            save(mem);
        }
    }

    function addEmotionalEvent(emotion) {
        const mem = load();
        mem.emotionalHistory.push({ emotion, ts: Date.now() });
        if (mem.emotionalHistory.length > 50) {
            mem.emotionalHistory = mem.emotionalHistory.slice(-50);
        }
        mem.lastEmotion = emotion;
        save(mem);
    }

    function learnFact(fact) {
        const mem = load();
        if (fact && !mem.thingsLearned.includes(fact)) {
            mem.thingsLearned.push(fact);
            if (mem.thingsLearned.length > 50) mem.thingsLearned = mem.thingsLearned.slice(-50);
            save(mem);
        }
    }

    function incrementSession() {
        const mem = load();
        mem.sessionCount = (mem.sessionCount || 0) + 1;
        if (!mem.firstMeet) mem.firstMeet = Date.now();
        save(mem);
        return mem.sessionCount;
    }

    function reset() {
        localStorage.removeItem(KEY);
    }

    return { get, set, addMessage, addTopic, addEmotionalEvent, learnFact, incrementSession, reset };
})();
