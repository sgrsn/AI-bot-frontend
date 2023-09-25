import React, { useState, useEffect  } from 'react';
import Select from "react-select";
import axios from 'axios';

function App() {
    const [inputText, setInputText] = useState(''); // ユーザー入力を管理するステート
    const [videoUrl, setVideoUrl] = useState('');  // 動画のURLを表示するためのステート
    const [selectedOption, setSelectedOption] = useState(null); // 選択されたオプションを管理
    
    // ドロップダウンメニューのオプション
    const imageOptions = [
        { value: 'sensei', label: '武居教授' },
        { value: 'hidaka', label: '大学院生A' },
    ];

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    }

    const handleSubmit = async () => {
        try {
            // 仮にバックエンドエンドポイントが http://localhost:5000/api だとする
            const response = await axios.post('http://localhost:5000/api', {
                text: inputText, 
                human: selectedOption ? selectedOption.value : null // 選択された画像の値をリクエストに同梱
            });
            const uniqueVideoUrl = `${response.data.result}?timestamp=${new Date().getTime()}`;  // タイムスタンプを追加
            setVideoUrl(uniqueVideoUrl);
        } catch (error) {
            console.error("APIリクエスト中にエラーが発生しました:", error);
            setVideoUrl('');
        }
    }

    useEffect(() => {
        // 定期的にテキストデータを取得する関数
        const fetchText = async () => {
            try {
                const response = await axios.get('http://localhost:8000/get_text');
                setInputText(response.data.text);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // 3秒ごとにfetchTextを実行
        const interval = setInterval(fetchText, 3000);

        // クリーンアップ関数
        return () => clearInterval(interval);
    }, []); 

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
            <Select
                value={selectedOption}
                onChange={setSelectedOption}
                options={imageOptions}
                placeholder="画像を選択..."
                styles={{
                    container: (provided) => ({
                      ...provided,
                      width: '300px'
                    })
                  }}
            />
        </div>
    );
}

export default App;
