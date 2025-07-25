import React, { useState, useEffect } from "react";
import axious from 'axios';
import './History.css';


function History({ needsUpdate }) {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                console.log('[履歴] 履歴取得APIを呼び出します...');
                const response = await axious.get('/api/history');
                setHistoryList(response.data);
                console.log('[履歴] 履歴を取得しました:', response.data);                
            } catch(error) {
                console.log('[履歴] 履歴の取得に失敗しました:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [needsUpdate]) // needsUpdateが変更されるたびに、このuseEffectが再実行される


    // ローディング中の表示
    if (loading) {
        return (
            <div className="history-container">
                <h2>計算履歴</h2>
                <p>読み込み中..</p>
            </div>
        )
    };


    return (
        <div className="history-container">
            <h2>計算履歴</h2>
            {historyList.length === 0 ? (
                <p>履歴はありません</p>
            ) : (
                <ul>
                    {historyList.map((item) => (
                        <li key={item.id}>
                            {item.expression} = {item.result}
                        </li>
                    ))}
                </ul>
            )}
        </div> 
    )
}

export default History;