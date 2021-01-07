$(function () {

    //popup或者bg向content主动发送消息
    function sendMessageToContentScript(message, callback) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
                if (callback) callback(response);
            });
        });
    }

    // 监听来自content-script的消息
    // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //     $("#msg").append('<p>收到来自content-script的消息：' + request + sender + sendResponse + '</p>')
    //     sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
    // });

    $("#btn").on("click", function () { //添加屏蔽词

        var word = $.trim($("#text").val())
        if (word != "" && word != null && word != undefined) {    
            //向content-script发送屏蔽词
            sendMessageToContentScript({
                word: word,
                type: 'add'
            }, function (response) {
                 //更新popup页面
                $("table").append('<tr><td class="word">' + word + '</td><td><button class="remove" data-word="' + word + '">移除</button></td></tr>')

                $("#msg").append('<p>添加屏蔽词' + word + '</p>' + '<p>收到回复：' + response + '</p>')
                // 更新屏蔽词
                // var words = []
                // $("table td.word").each(function (index) {
                //     words.push($(this).text())
                // })
                // chrome.storage.sync.set({
                //     words: words
                // }, function () {
                //     $("#msg").append('<p>已添加关键词:' + words + '</p>')
                // });

            });
        }

    })

    $("table").on('click', 'button', function () { //移除屏蔽词
        // $("#msg").append('<p>移除</p>')
        var word = $(this).data('word')
        // var word = $(this).text()
        $("#msg").append('<p>移除屏蔽词:' + $(this).data('word') + '</p>')
        // $("#msg").append('<p>移除关键词:' + $(this).attr('data-word') + '</p>')
        //  向content-script发送屏蔽词
        $(this).closest('tr').remove()
        sendMessageToContentScript({
            word: word,
            type: 'remove'
        }, function (response) {
            // $(this).closest('tr').remove()
            $("#msg").append('<p>收到回复：' + response + '</p>')
        });
    })

    chrome.storage.sync.get({
        words: []
    }, function (items) {
        $(items.words).each(function (index) {
            $("table").append('<tr><td class="word">' + this + '</td><td><button class="remove" data-word="' + this + '">移除</button></td></tr>')
        })
        $("#msg").append('<p>已有屏蔽词：' + items.words + '</p>')
    });
});