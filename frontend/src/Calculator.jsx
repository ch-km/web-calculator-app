import React, { useState } from 'react';

import './Calculator.css';


function Calculator() {

  // --- 状態変数を定義 ---
    const [displayValue, setDisplayValue] = useState('0');
    const [prevValue, setPrevValue] = useState(null);
    const [operator, setOperator] = useState(null);

    // waitingForOperand: 演算子を押した後、次の数字の入力を待っている状態か
    const [waitingForOperand, setWaitingForOperand] = useState(false);
  // --- ここまで ---

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
    const operatorClick = (nextOperator) => {
        const inputValue = parseFloat(displayValue); // 現在の表示値を数値に変換

        if (prevValue === null) {
            // 最初の演算子入力の場合
            setPrevValue(inputValue);
        } else if (operator) {
            // 既に演算子が選択されている場合（連続演算）
            const result = calculate(prevValue, inputValue, operator); // 計算を実行
            setDisplayValue(String(result)); // 結果を表示
            setPrevValue(result); // 結果を次のprevValueにする
        }

        setWaitingForOperand(true); // 次の数字入力を待つ状態にする
        setOperator(nextOperator) // 新しい演算子をセット
    };

    // クリアボタンがクリックされたときの処理
    const clearClick = () => {
        setDisplayValue('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    // イコールボタンがクリックされたときの処理
    const equalsClick = () => {
        if (prevValue === null || operator === null) {
            // 計算に必要な情報が揃っていない場合は何もしない
            return;
        }

        const inputValue = parseFloat(displayValue);
        const result = calculate(prevValue, inputValue, operator); // 計算を実行
    
        setDisplayValue(String(result)); // 結果を表示
        setPrevValue(null); // 計算が終わったので前の値はリセット
        setOperator(null); // 演算子もリセット
        setWaitingForOperand(false); // 次の入力は新しい計算の開始
    };

    // 実際の計算を行うヘルパー関数
    const calculate = (num1, num2, op) => {
        switch (op) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            case '/':
                // ゼロ除算のチェック
                if (num2 === 0) {
                return 'Error'; // エラー表示
                }
                return num1 / num2;
            default:
                return num2; // 演算子がない場合はnum2を返す（ありえないが念のため）
        }
    };

    return (
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
    );
}

export default Calculator;