import React from "react";
import Calculator from "./Calculator";
import './App.css'; //スタイリング用のCSSファイル読み込み


// Appという名前の「関数コンポーネント」を定義：Reactアプリのメイン
function App() {
  return(
    // <div className="App"> は、見た目を整えるための箱
    <div className="App">
      {/* ここでCalculatorコンポーネントを呼び出す */}
      {/* これにより、Calculator.jsxで定義した電卓の見た目が画面に表示される */}
      <Calculator />
    </div>
  );
}

export default App;
