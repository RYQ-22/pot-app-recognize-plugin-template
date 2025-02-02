async function recognize(base64, lang, options) {
    const { config, utils } = options;
    const { tauriFetch } = utils;
    let { apikey, engine } = config;
    base64 = `data:image/png;base64,${base64}`;

    if (apikey === undefined || apikey.length === 0) {
        throw "apikey not found";
    }
    if (engine === undefined || engine.length === 0) {
        engine = "1";
    }

    let res = await tauriFetch('https://api.ocr.space/parse/image', {
        method: "POST",
        headers: {
            "apikey": apikey,
            "content-type": "application/x-www-form-urlencoded"
        },
        body: {
            type: "Form",
            payload: {
                base64Image: base64,
                OCREngine: engine,
                language: lang
            }
        }
    })

    if (res.ok) {
        const data = res.data;
        if (data && data.ParsedResults && data.ParsedResults.length > 0) {
            let parsedText = data.ParsedResults[0].ParsedText; // 直接从第一个结果获取 ParsedText
            return parsedText; // 返回解析出的文本
        } else {
            throw "No parsed results available";
        }
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }       
}
