import React, { useState } from 'react';
import axios from 'axios';
import './Calculator.css';
import History from './components/History';


function Calculator() {

  // --- 状態変数を定義 ---
    const [displayValue, setDisplayValue] = useState('0');
    const [prevValue, setPrevValue] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

  // 数字ボタンがクリックされたときの処理
    const numClick = (num) => {
        if (waitingForOperand) {
            // 演算子を押した後、表示を新しい数字に置き換える
            setDisplayValue(num);
            setWaitingForOperand(false);
        } else {
            // 表示されている数字に小数点が含まれており、さらに小数点入力の場合は無視
            if (num === '.' && displayValue.includes('.')) {
                return;
            }
            // 論理式：displayValueが'0'で、かつ入力された数字が'.'でない場合
            // 真：電卓の表示を、新しく入力された数字（num）に置き換える
            // 偽：現在の表示値（displayValue）に、新しく入力された数字（num）を文字列として連結する
            setDisplayValue(displayValue === '0' && num !== '.' ? num : displayValue + num);
        }
    };
    
    // 演算子ボタンがクリックされたときの処理
    // API通信は時間がかかる可能性があるので、asyncキーワードで非同期関数にする。
    const operatorClick = async (nextOperator) => {
        const inputValue = parseFloat(displayValue); // 現在の表示値を数値に変換

        // 連続計算（例: 1 + 2 + ...）の場合、2つ目の演算子が押された時点で
        // それまでの計算（1 + 2）をAPIに送って実行する。
        if (operator && !waitingForOperand) {
            const expression = `${prevValue}${operator}${inputValue}`;
            console.log(`[演算子] 中間計算の式をAPIに送信: ${expression}`);

            try {
                // バックエンドに計算式をPOSTリクエストで送信
                const response = await axios.post('/api/calculate', {expression});
                const result = response.data.result;
                console.log(`[演算子] APIからの中間結果: ${result}`);

                // APIから返ってきた結果で表示と内部の値を更新
                setDisplayValue(String(result))
                setPrevValue(result)

            } catch(error) {
                console.error('[演算子] API呼び出しに失敗しました:', error);
                setDisplayValue('Error');
                setPrevValue(null);
                setOperator(null);
                setWaitingForOperand(false);
                return; // エラーが発生したら処理を中断

            }
        } else {
            // 最初の数字と演算子が入力された場合
            setPrevValue(inputValue);
        }

        setWaitingForOperand(true); // 次の数字入力を待つ状態にする
        setOperator(nextOperator); // 新しい演算子をセット
    };


    // クリアボタンがクリックされたときの処理
    const clearClick = () => {
        setDisplayValue('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    // イコールボタンがクリックされたときの処理
    // こちらも同様に非同期関数にする。
    const equalsClick = async () => {
        // 計算に必要な情報が揃っていない場合は何もしない
        if (prevValue === null || operator === null || waitingForOperand) {
            return;
        }

        const inputValue = parseFloat(displayValue);

        // APIに送るための計算式を文字列として組み立てる (例: "10+5")
        const expression = `${prevValue}${operator}${inputValue}`;
        console.log(`[イコール] 最終的な計算式をAPIに送信: ${expression}`);

        try {
            // バックエンドに計算式をPOSTリクエストで送信
            const response = await axios.post('/api/calculate', {expression});
            console.log(`[イコール] APIからの最終結果:`, response.data);

            // APIから返ってきた結果で表示を更新
            setDisplayValue(String(response.data.result));
            
            // 計算が完了したので、内部の状態をリセット
            setPrevValue(null);
            setOperator(null);
            setWaitingForOperand(false);

        } catch(error) {
            console.error('[イコール] API呼び出しに失敗しました:', error);
            setDisplayValue('Error');
            setPrevValue(null);
            setOperator(null);
            setWaitingForOperand(false);
        }
    };


    return (
        // calculator-containerを囲む親要素を追加
        <div className='app-container'>
            <div className="calculator-container">
                <div className="calculator-display">{displayValue}</div> {/* displayValueを動的に表示 */}

                <div className="calculator-buttons">
                    <button className="button" onClick={() => numClick('7')}>7</button>
                    <button className="button" onClick={() => numClick('8')}>8</button>
                    <button className="button" onClick={() => numClick('9')}>9</button>
                    <button className="button operator" onClick={() => operatorClick('/')}>/</button>

                    <button className="button" onClick={() => numClick('4')}>4</button>
                    <button className="button" onClick={() => numClick('5')}>5</button>
                    <button className="button" onClick={() => numClick('6')}>6</button>
                    <button className="button operator" onClick={() => operatorClick('*')}>*</button>

                    <button className="button" onClick={() => numClick('1')}>1</button>
                    <button className="button" onClick={() => numClick('2')}>2</button>
                    <button className="button" onClick={() => numClick('3')}>3</button>
                    <button className="button operator" onClick={() => operatorClick('-')}>-</button>

                    <button className="button clear" onClick={clearClick}>C</button>
                    <button className="button" onClick={() => numClick('0')}>0</button>
                    <button className="button decimal" onClick={() => numClick('.')}>.</button>
                    <button className="button operator" onClick={() => operatorClick('+')}>+</button> {/* '+'ボタンを追加 */}
                </div>

                {/* イコールボタン専用の行 */}
                <div className="calculator-equals-row">
                <button className="button operator equals" onClick={equalsClick}>=</button>
                </div>
            </div>
            <History /> {/* 作成したHistoryコンポーネントを配置 */}
        </div>
    );
}

export default Calculator;