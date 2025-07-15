import React from "react";
import './App.css'; //スタイリング用のCSSファイル読み込み


// Appという名前の「関数コンポーネント」を定義：Reactアプリのメイン
function App() {
  // return の中に、このコンポーネントが画面に何を表示するかを記述。
  // ここに書かれたHTMLのようなものがブラウザに表示される。
  return(
    // <div className="App"> は、見た目を整えるための箱
    <div className="App">
      <h1>Hello, React!</h1>
    </div>
  );
}

export default App;
