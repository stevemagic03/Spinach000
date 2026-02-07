import { GoogleGenerativeAI } from '@google/genai';

// 提示词模板
export const PROMPT_TEMPLATE = `【人物与面容】
核心人物： 以上传图片为唯一面部参考，100%精确重构该人物的面部骨骼结构、皮肤纹理、发型及神态...
[INSERT MOVIE NAME HERE]主演： 呈现其于电影拍摄期间的样貌...
互动状态： 两人身着各自的戏服，在电影拍摄间隙...

【镜头与构图】
镜头： 专业人像摄影机模式拍摄... [INSERT DOF HERE]
构图： [INSERT RATIO HERE] 采用生活化、不拘谨的抓拍构图...

【灯光与色彩】
主光源： 完全遵循所选电影场景的环境光逻辑...
色彩风格： 电影风格的色调...

【服装与造型】
上传人物着装： 保持不变...
[INSERT MOVIE NAME HERE]主演着装： 符合剧中时代与角色...

【动作与场景】
核心动作： 电影拍摄被短暂打断...
关键元素： 画面中需明确可见电影拍摄现场的痕迹（摄影机、灯光架、麦克风杆等）...

【画面风格与细节】
细节： 模拟柯达Vision3 500T电影胶片质感，带有自然的银盐颗粒感...
画面氛围： 温暖、怀旧、充满人情味...

【最终画面感受总结】
一张超写实的照片，仿佛闯入了拍摄现场...`;

const DOF_MAP = {
    'f/1.2': '浅景深，背景虚化营造电影质感',
    'f/4': '标准景深，主体清晰同时保留一定环境细节',
    'f/11': '深景深，全景清晰，展现完整的片场环境'
};

const RATIO_MAP = {
    '9:16': '竖屏构图，适合手机端浏览，上下留白营造呼吸感',
    '3:4': '经典竖画幅，接近杂志封面比例',
    '4:3': '传统电视画幅，四平八稳的经典电影感',
    '16:9': '宽银幕画幅，电影级全景构图'
};

export const buildPrompt = (movieName, dof, ratio, customPrompt) => {
    if (customPrompt) return customPrompt;
    let finalPrompt = PROMPT_TEMPLATE;
    finalPrompt = finalPrompt.replace(/\[INSERT MOVIE NAME HERE\]/g, movieName || '经典好莱坞电影');
    finalPrompt = finalPrompt.replace(/\[INSERT DOF HERE\]/g, DOF_MAP[dof] || DOF_MAP['f/1.2']);
    finalPrompt = finalPrompt.replace(/\[INSERT RATIO HERE\]/g, RATIO_MAP[ratio] || RATIO_MAP['16:9']);
    return finalPrompt;
};

export const generateSetPhoto = async (apiKey, prompt, referenceImage, aspectRatio = '16:9', count = 1) => {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });
    const generateTask = async () => {
        try {
            let content = prompt;
            if (referenceImage) {
                content = [{ inlineData: { mimeType: 'image/jpeg', data: referenceImage } }, prompt];
            }
            const result = await model.generateContent({
                contents: content,
                generationConfig: { temperature: 0.9, topP: 0.95, maxOutputTokens: 8192 }
            });
            const imageData = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (imageData) return `data:image/jpeg;base64,${imageData}`;
            throw new Error('No image generated');
        } catch (error) {
            console.error('Generation error:', error);
            throw error;
        }
    };
    if (count > 1) return Promise.all([generateTask(), generateTask()]);
    return [await generateTask()];
};

export const editSetPhoto = async (apiKey, image, editPrompt) => {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-image' });
    try {
        const base64Data = image.split(',')[1];
        const content = [{ inlineData: { mimeType: 'image/jpeg', data: base64Data } }, editPrompt];
        const result = await model.generateContent({
            contents: content,
            generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 8192 }
        });
        const imageData = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (imageData) return `data:image/jpeg;base64,${imageData}`;
        throw new Error('No image edited');
    } catch (error) {
        console.error('Edit error:', error);
        throw error;
    }
};

export const getMoviePosterImpression = async (apiKey, movieName) => {
    if (!movieName || movieName.length < 2) return null;
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-image' });
    try {
        const prompt = `A cinematic, iconic movie poster for the movie "${movieName}" - artistic, atmospheric, single color tone, minimalist style, suitable for background overlay`;
        const result = await model.generateContent({
            contents: prompt,
            generationConfig: { temperature: 0.8, topP: 0.9 }
        });
        const imageData = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (imageData) return `data:image/jpeg;base64,${imageData}`;
        return null;
    } catch (error) {
        console.error('Poster impression error:', error);
        return null;
    }
};

export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
