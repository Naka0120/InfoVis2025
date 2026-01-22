# InfoVis2025 W12 ディレクトリの概要

このディレクトリには、InfoVis2025の第12週の演習用コードが含まれています。主にD3.jsを使用したデータ可視化の基本的な実装と、インタラクションの実装例があります。データセットにはアヤメのデータ（Iris dataset）が使用されています。

## ファイル構成と内容

### 例題 (Examples)

このディレクトリには、ステップバイステップで可視化を作成・拡張していく3つの例が含まれています。

*   **`w12_ex01` (散布図)**
    *   **概要**: Irisデータセットの `sepal_length` (がく片の長さ) と `sepal_width` (がく片の幅) を軸とした**散布図 (Scatter Plot)** を描画します。
    *   **ファイル**: `w12_ex01_index.html`, `w12_ex01_main.js`, `w12_ex01_ScatterPlot.js`

*   **`w12_ex02` (棒グラフ)**
    *   **概要**: Irisデータセットの `species` (品種) ごとのデータ数を集計し、**棒グラフ (Bar Chart)** として可視化します。
    *   **ファイル**: `w12_ex02_index.html`, `w12_ex02_main.js`, `w12_ex02_BarChart.js`

*   **`w12_ex03` (連携した可視化 - Linked Views)**
    *   **概要**: 散布図と棒グラフを同時に表示し、それらを連携させています。棒グラフの特定の品種（バー）をクリックすることで、散布図に表示されるデータをフィルタリングするインタラクション（Linked Views）が実装されています。
    *   **ファイル**: `w12_ex03_index.html`, `w12_ex03_main.js`, `w12_ex03_ScatterPlot.js`, `w12_ex03_BarChart.js`

### データファイル

*   `iris.csv`: カンマ区切りのIrisデータセット。
*   `iris.data`, `iris.names`, `iris.orig.csv`: その他の形式やオリジナルのデータファイル。
