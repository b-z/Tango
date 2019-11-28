function renderImi(word) {
    if (word.imi.length) {
        var imi = word.imi.split('\n');
        var fr_count = 2;
        imi.forEach(function(e, j) {
            e = e.split(/[\[\]]/);
            if (e[0].length)
                e[0] = '<div class="setsumei" lang="zh">' + e[0] + '</div>';
            for (var i = 1; i < e.length; i++) {
                if (e[i] != '') {
                    var f = e[i].split('/');
                    var reibun = f[0];

                    reibun = reibun.split('＜').join('<ruby>');
                    reibun = reibun.split('＞').join('</ruby>');
                    reibun = reibun.split('（').join('<rt>');
                    reibun = reibun.split('）').join('</rt>');
                    if (word.furansugo == "true" && word.ipa) {
                        reibun = reibun+'<grey>\\'+word.ipa.split('\r\n')[fr_count]+' \\</grey>';
                        // reibun = '<ruby>'+reibun+'<rt>'+word.ipa.split('\r\n')[fr_count]+'</rt></ruby>';
                        fr_count++;
                    }
                    if (word.furansugo == "true") {
                        reibun = '<div class="reibun" lang="fr">' + reibun + '</div>';
                    } else {
                        reibun = '<div class="reibun" lang="ja">' + reibun + '</div>';
                    }
                    var honyaku = f.length > 1 ? ('<div class="honyaku" lang="zh">' + f[1] + '</div>') : '';

                    e[i] = reibun + honyaku;
                }
            }

            imi[j] = '<div>' + e.join('') + '</div>';
        });
        imi = imi.join('');
        $('.imi').html(imi);
    }
}

function renderHinshi(word) {

    if (word.hinshi.length) {
        var h = word.hinshi.split(' ');
        var t = {
            "mei": "名・",
            "ji": "自",
            "ta": "他",
            "sa": "サ・",
            "go": "五・",
            "ichi": "一・",
            "kei": "形・",
            "keidou": "形動・",
            "fuku": "副・",
            "setsubigo": "接尾・",
            "kan": "感・",
            "setsuzoku": "接続・",
            "rentai": "連体・",
        }
        for (var i = 0; i < h.length; i++) {
            h[i] = t[h[i]];
        }
        h = h.join('');
        if (h[h.length - 1] == "・") {
            h = h.substr(0, h.length - 1);
        }
        $('.tango .hinshi').html(h);
    }
}

function renderAkusento(word) {
    if (word.furansugo == "true") {
        return;
    }
    if (word.akusento.length) {
        var w = $('.title').width() * 2;
        var h = $('.title').height() * 2;
        $('.title').prepend('<canvas width="' + w + 'px" height="' + h + 'px"></canvas>');
        var ctx = $('.title canvas')[0].getContext('2d');
        var txt = word.hiragana;
        var acc = parseInt(word.akusento);
        var len = txt.length + 1;
        // for (var i = 0; i < txt.length ; i++) {
        //     if ('ゃゅょャュョ'.indexOf(txt[i]) >= 0) {
        //         len--;
        //     }
        // }
        var a = [];
        var cw = w / (len - 1);
        for (var i = 0; i < len; i++) {
            a.push(false);
        }
        switch (acc) {
            case 0:
                for (var i = 1; i < len; i++) {
                    a[i] = true;
                }
                break;
            case 1:
                a[0] = true;
                break;
            default:
                for (var i = 1; i < acc; i++) {
                    a[i] = true;
                }
        }
        for (var i = 0; i < len - 1; i++) {
            if ('ゃゅょャュョ'.indexOf(txt[i]) >= 0) {
                for (var j = len - 1; j >= i; j--) {
                    a[j] = a[j - 1];
                }
            }
        }
        var high = h * 0.1;
        var low = h - high;
        ctx.strokeStyle = color_value_second;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, a[0] ? high : low);
        for (var i = 0; i < len - 1; i++) {
            /*var p = i==0?a[0]:a[i-1];
            var q = a[i];
            var r = a[i+1];*/
            ctx.lineTo(i * cw + cw * 1 / 3, a[i] ? high : low);
            ctx.lineTo(i * cw + cw * 2 / 3, a[i] ? high : low);
        }
        ctx.lineTo(w + cw * 1 / 3, a[len - 1] ? high : low);
        ctx.stroke();
    }
}

function renderWord(word) {
    var html = '';
    if (word.furansugo == "true") {
        html += '<div class="furansugo">' +
            '<div class="title" lang="fr">' +
                '<ruby>' + word.hiragana.split('/')[0] + '<rt>\\' + word.ipa.split('\r\n')[0] + ' \\</rt></ruby>' +
            '</div>';
        if (word.hiragana.split('/').length > 1) {
            html += '<div class="title2 ' + second_color + '-text text-darken-1" lang="fr">' +
                '<ruby>(' + word.hiragana.split('/')[1] + ')<rt>\\' + word.ipa.split('\r\n')[1] + ' \\</rt></ruby>' +
            '</div>';
        }
        html += '<div class="clear"></div>';
        if (word.akusento != "") {
            html += '<div class="akusento">' +
                (word.akusento=='f'?'la':(word.akusento=='m'?'le':'le / la')) +
            '</div>';
        }
        if (word.kanji != "") {
            html += '<div class="hinshi">' +
                word.kanji +
            '</div>'
        }

        html += '<div class="clear"></div>';
        if (word.imi != "") {
            html += '<div class="imi"></div>';
        }
        html += '</div>';
        html += '<div class="main-blank"></div>';
        html += '<div class="mask center" onclick="hideMask();">' +
                    '<div lang="zh">' +
                    '尝试回忆法语单词' +
                    '</div><div class="title_test ' + second_color + '-text text-darken-1" lang="fr">' +
                    word.hiragana +
                    '</div><div lang="zh">' +
                    '的<u>用法</u>及<u>释义</u>' +
                    '</div>' +
                '</div>';
    } else if (word.bunpou == "true") {
        html += '<div class="bunpou">' +
            '<div class="title" lang="ja">' +
                word.hiragana +
            '</div>' +
            '<div class="clear"></div>';
        if (word.kanji != "") {
            html += '<div class="tsukaikata ' + second_color + '-text text-darken-1" lang="ja">' +
                    '[' + word.kanji + ']' +
                '</div>';
            html += '<div class="clear"></div>';
        }

        if (word.imi != "") {
            html += '<div class="imi"></div>';
        }
        html += '</div>';
        html += '<div class="main-blank"></div>';
        html += '<div class="mask center" onclick="hideMask();">' +
                    '<div lang="zh">' +
                    '尝试回忆语法' +
                    '</div><div class="title_test ' + second_color + '-text text-darken-1" lang="ja">' +
                    word.hiragana +
                    '</div><div lang="zh">' +
                    '的<u>用法</u>及<u>释义</u>' +
                    '</div>' +
                '</div>';
    } else {
        html += '<div class="tango">' +
            '<div class="title" lang="ja">' +
                word.hiragana +
            '</div>';
        if (word.kanji != "") {
            html += '<div class="kanji ' + second_color + '-text text-darken-1" lang="ja">' +
                '[' + word.kanji + ']' +
            '</div>';
        }
        html += '<div class="clear"></div>';
        if (word.akusento != "") {
            html += '<div class="akusento">' +
                word.akusento +
            '</div>';
        }
        if (word.hinshi != "") {
            html += '<div class="hinshi"></div>';
        }
        html += '<div class="clear"></div>';
        if (word.imi != "") {
            html += '<div class="imi"></div>';
        }
        html += '</div>';
        html += '<div class="main-blank"></div>';

        html += '<div class="mask center" onclick="hideMask();">' +
                    '<div lang="zh">' +
                    '尝试回忆单词' +
                    '</div><div class="title_test ' + second_color + '-text text-darken-1" lang="ja">' +
                    (word.yomikata=="true"?word.kanji:word.hiragana) +
                    '</div><div lang="zh">' +
                    (word.yomikata=="true"?(word.tsukaikata=="true"?'的<u>读音</u>及<u>释义</u>':'的<u>读音</u>'):'的<u>释义</u>') +
                    '</div>' +
                '</div>';
    }
    $('main').html(html);
    renderImi(word);
    renderHinshi(word);
    renderAkusento(word);
    $('#counter1').text(pointer + 1);
    $('#counter2').text(array.length);
    $('.counter').css('display', 'block');
}
