import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [inputText, setInputText] = useState(''); // ユーザー入力を管理するステート
    const [videoUrl, setVideoUrl] = useState('');  // 動画のURLを表示するためのステート

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    }

    const handleSubmit = async () => {
        try {
            // 仮にバックエンドエンドポイントが http://localhost:5000/api だとする
            const response = await axios.post('http://localhost:5000/api', {
                text: inputText
            });
            const uniqueVideoUrl = `${response.data.result}?timestamp=${new Date().getTime()}`;  // タイムスタンプを追加
            setVideoUrl(uniqueVideoUrl);
        } catch (error) {
            console.error("APIリクエスト中にエラーが発生しました:", error);
            setVideoUrl('');
        }
    }

    return (
        <div className="App">
            <h1>AI-bot</h1>
            <div>
                <textarea
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="こちらにテキストを入力してください"
                    rows="5"
                    cols="50"
                ></textarea>
            </div>
            <button onClick={handleSubmit}>送信</button>
            <div>
                <h2>Result:</h2>
                { videoUrl && (
                    <video controls width="320" height="240" key={videoUrl} autoPlay>
                        <source src={videoUrl} type="video/mp4" />
                        ご利用のブラウザはビデオタグをサポートしていません。
                    </video>
                )}
            </div>
        </div>
    );
}

export default App;
