//content-scripts和原始页面共享DOM，但是不共享JS
// function hide(word) {
//     $('table.olt tr:not(.th)').each(function (index) {
//         var title = $(this).children('.title').children('a').attr('title')
//         if (title.indexOf(word) >= 0) {
//             // $(this).css('background', 'red')
//             $(this).hide()
//         }

//     })
// }

// function show(word){
//     $('table.olt tr:not(.th)').each(function (index) {
//         var title = $(this).children('.title').children('a').attr('title')
//         if (title.indexOf(word) >= 0) {//包含该屏蔽词
//             // $(this).css('background', 'red')
//             $(this).show()
//         }

//     })
// }

function handle(data) {
    // console.log('handle:' + data.word + data.type)
    $('table.olt tr:not(.th)').each(function (index) {
        var title = $(this).children('.title').children('a').attr('title')
        // console.log(title)
        if (title.indexOf(data.word) >= 0) {
            // console.log("包含------------" + data.word)
            // if (data.type == 'remove'){ $(this).css('background', '#f5f5f5'); console.log("grey:" + data.word)}
            if (data.type == 'add') {
                // $(this).css('background', 'red')
                // $(this).hide()
                $(this).fadeOut();
                console.log("hide--" + title)
                // console.log("red:" + data.word)
            } else {
                // $(this).css('background', '#f5f5f5')
                // console.log("grey:" + data.word)
                // $(this).show()
                $(this).fadeIn();
                console.log("show++" + title)
            }

            // $(this).hide()
        }

    })
}

/**
 * 
 * @param {type:'', words: []} data 
 */
function handleByBatch(data) {
    // console.log('handle:' + data.word + data.type)
    if(data.type == 'add'){
        $('table.olt tr:not(.th)').each(function (index) {
            var title = $(this).children('.title').children('a').attr('title')  
            var el = $(this);
            $(data.words).each(function(i){
                if (title.indexOf(data.words[i]) >= 0) {             
                    $(el).hide()
                    console.log("hide--" + title)
                }
            })
        })
    }else{
        $('table.olt tr:not(.th)').each(function (index) {
            var title = $(this).children('.title').children('a').attr('title')  
            var el = $(this);
            $(data.words).each(function(i){
                if (title.indexOf(data.words[i]) >= 0) {             
                    $(el).show()
                    console.log("show--" + title)
                }
            })
        })
    }
}

/**
 *  @param {type:'', word: ''} data 
 */
function updateWords(data) {
    console.log('updateWords:' + data.word + data.type)
    chrome.storage.sync.get({words: []}, function (items) {
        var words = items.words
        if (data.type == 'add') {        
            words.push(data.word)
        } else if (data.type == 'remove') {
            // var copy = words.slice()
            $(words).each(function(index){
                if(this == data.word){
                    words.splice(index, 1)
                    // break
                    return true
                } 
            })
        } else;
        chrome.storage.sync.set({words: words}, function () {
                console.log("屏蔽词【" + data.word + '】,更新后为：' + words)
        });
    });
}

$(function () {
    console.log("1245236")

    // 读取数据，第一个参数是指定要读取的key以及设置默认值
    chrome.storage.sync.get({
        words: []
    }, function (items) {
        console.log('start:' + items.words)
        // $(items.words).each(function (index) {
        //     // hide(this)
        //     handle({word : this, type : 'add'})
        // })
        handleByBatch({type: 'add', words: items.words})
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        handle(request)
        sendResponse('done~')
        updateWords(request)

    });


});