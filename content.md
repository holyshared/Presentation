Presentation
====================================================

Presentation
----------------------------------------------------

author: Noritaka Horio<holy.shared.design@gmail.com>


Presentation.js
----------------------------------------------------

### About this library

Presentation.jsは**html、css、javascript**を利用してプレゼンテーション用のスライドを作成できるjavascriptライブラリです。  
「ユーザーの自由を奪わないこと」をコンセプトとして、拡張可能な設計を実現しています。

### ライブラリの特徴

大きな特徴として次のものがあります。

* ヘルパーを利用したプラグイン拡張の提供
* コンテンツの最適化機能の提供
* スライドの初期化機能の提供
* サードパーティ性のライブラリを利用したiPad対応


ライブラリ構成
----------------------------------------------------

Presentation.jsのライブラリ構成は次の通りです。  
コアのライブラリにMootools、iPad対応の為にPowertoolsを利用してます。  
Various Stockは私が配布しているプラグインライブラリです。

<table>
    <thead>
        <tr>
            <th>library</th>
            <th>normal size</th>
            <th>compressed size</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Mootools Core</td>
            <td>XXXkb</td>
            <td>XXXkb</td>
        </tr>
        <tr>
            <td>Various Stock</td>
            <td>XXXkb</td>
            <td>XXXkb</td>
        </tr>
        <tr>
            <td>Powertools (Optional)</td>
            <td>XXXkb</td>
            <td>XXXkb</td>
        </tr>
        <tr>
            <th>Total size</th>
            <td>XXXkb</td>
            <td>XXXkb</td>
        </tr>
    </tbody>
</table>



Presentation.jsの機能
----------------------------------------------------

### 3つの大きな特徴

Presentation.jsには大きな3つの特徴があります。
ひとつずつ順番にご紹介します。




特徴1 ヘルパーを利用したプラグイン
----------------------------------------------------

### プラグインの組み込みによる拡張

ヘルパープラグインはプレゼンテーションの内容に合わせて自由に組み込むことができます。  
最初から用意されているプラグインは下記の通りです。

* Keyboard - キーボードによるスライドの操作を可能にします
* Page - 現在表示しているページ情報を表示すします
* Controller - スライドを操作できるインターフェースを提供します
* Swipe - スライドをモバイル端末でのタップ操作に対応させます。

var presentation = new Presentation();

//キーボード操作を可能するヘルパーを組み込みます。
presentation.addHelper(new Presentation.Helper.Keyborad());

//Swipe操作を可能するヘルパーを組み込みます。
presentation.addHelper(new Presentation.Helper.Swipe());

presentation.start();


特徴2 強力なコンテンツフィルター
----------------------------------------------------

### フィルターを利用したコンテンツの最適化

フィルターを利用すると自由にコンテンツを最適化することができます。  
フィルターは該当するコンテンツが表示される時と、非表示になる時に適用されます。

このタイミングで、コンテンツの一部を差し替えたり、新しい内容を追加することができます。

var presentation = new Presentation();
presentation.addFilter({

    activate: function(content){
        var images = $(content).getElements('img');
        images.setStyles({
            padding: 10,
            border: '1px solid #cccccc'
        });
    },

    deactivate: function(content){
        var images = $(content).getElements('img');
        images.setStyles({
            padding: 0,
            border: 'none'
        });
    }

});
presentation.start();






特徴3 ブートストラップによるスライドの初期化
----------------------------------------------------

### 自由にスライドを最適化する

ブートストラップ機能を利用すると、スライドの初期化を自由に行うことができます。  
例えばスライドの内容をAjaxで動的に読み込んだり、フルスクリーン表示を行えるようになります。

また、初期化処理をモジュール化できるので、利用するケース毎のスライド設定を作成することが可能です。


Presentation.Bootstrap.register('contentLoad', {

    configuration: {
        url: '/path/to/contents'
    },

    handler: function(presentation, configuration){

        var that = this;
        var request = new Request.HTML({
            url: configuration.url,
            onSuccess: function(tree, elements, html, javascript){
                elements.each(function(element){
                    presentation.addContent(new Presentation.Content(element));
                });
                that.success();
            },
            onFailure: fucntion(error){
                that.failure(error);
            }
        });
        request.send();

    }

});



Presentation.Bootstrap.register('fullScreen', {

    handler: function(presentation, configuration){

        var height = 0;
        if (win.innerHeight) {
            height = win.innerHeight;
        } else if (doc.documentElement.clientHeight) {
            height = doc.documentElement.clientHeight;
        } else if (doc.body.clientHeight) {
            height = doc.body.clientHeight;
        }

        for (var i = 0; l = presentation.getLength(), i < l; i++){
            var content = presentation.getContent(i).toElement();
            content.setStyle('height', height);
        }
        $(presentation).setStyle('height', height);

        this.success();
    }

});

var presentation = new Presentation();
presentation.start();
