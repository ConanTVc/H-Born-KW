BOT = {
    chars: [],
    timeout: 500,
}
ARC = {
    timeout: 240,
}

GAME.emitOrder = (data) => GAME.socket.emit('ga', data);

BOT.Start = function () {
    if (this.chars.length > 0) {
        setTimeout(function () { BOT.LogIn(); }, this.timeout);
    } else {
        GAME.komunikat("KONIEC!");
    }
}

BOT.LogIn = function () {
    char_id = parseInt(this.chars);
    GAME.emitOrder({ a: 2, char_id: char_id });      //Select char, wybiera postac z konta, type:1 z zasty

    setTimeout(function () { ARC.sprBonusy(); }, this.timeout);
}

BOT.sign = function () {

    this.chars.shift();
    setTimeout(function () { BOT.Start(); }, this.timeout);
}

BOT.GetChars = function () {
    for (i = 0; i < GAME.player_chars; i++) {
        char = $("li[data-option=select_char]").eq(i);
        BOT.chars.push(char.attr("data-char_id"));
    }

}();

ARC.sprBonusy = function () {

    GAME.socket.emit('ga', { a: 25, type: 3 });

    setTimeout(() => {

        var bonusyKK = document.getElementById('shop_char_bon').children

        console.log(bonusyKK[0].innerText)
        bon_1 = 'Mistrz treningu5 Aktywuj na 1 dzień3 dni14 dni30 dniKup';
        bon_2 = 'Mistrz treningu II5 Aktywuj na 1 dzień3 dni14 dni30 dniKup';
        bon_3 = 'Wyciszenie5 Aktywuj na 1 dzień3 dni14 dni30 dniKup';

        if (bonusyKK[0].innerText == bon_1 && GAME.char_data.kk >= 10) {
            console.log('Nie masz bonusu nr1')
            setTimeout(function () { ARC.kup_bonus1(); }, this.timeout);
        }
        else if (bonusyKK[1].innerText == bon_2 && GAME.char_data.kk >= 10) {
            console.log('Nie masz Bonusu nr2')
            setTimeout(function () { ARC.kup_bonus2(); }, this.timeout);
        }
        else if (bonusyKK[16].innerText == bon_3 && GAME.char_data.kk >= 10) {
            console.log('Nie masz Bonusu nr3')
            setTimeout(function () { ARC.kup_bonus3(); }, this.timeout);
        }
        else {
            console.log('Jestes czysty, miales szczescie')
            setTimeout(function () { ARC.Reborn(); }, this.timeout);
        }
    }, 500);
}

ARC.kup_bonus1 = function () {
    GAME.socket.emit('ga', { a: 25, type: 5, id: 1, c: GAME.shop_data.currency, am: 4 });
    setTimeout(() => { $('.kom').remove(); }, 349)
    setTimeout(function () { ARC.sprBonusy(); }, this.timeout);
}
ARC.kup_bonus2 = function () {
    GAME.socket.emit('ga', { a: 25, type: 5, id: 14, c: GAME.shop_data.currency, am: 4 });
    setTimeout(() => { $('.kom').remove(); }, 349)
    setTimeout(function () { ARC.sprBonusy(); }, this.timeout);
}
ARC.kup_bonus3 = function () {
    GAME.socket.emit('ga', { a: 25, type: 5, id: 11, c: GAME.shop_data.currency, am: 4 });
    setTimeout(() => { $('.kom').remove(); }, 349)
    setTimeout(function () { ARC.sprBonusy(); }, this.timeout);
}

ARC.Reborn = function () {

    if (GAME.char_data.reborn >= 0 && GAME.char_data.reborn <= 2) {
        setTimeout(function () { ARC.Compare(); }, this.timeout);
    }
    else if (GAME.char_data.reborn >= 3 && GAME.char_data.reborn <= 4) {
        setTimeout(function () { ARC.Compare1(); }, this.timeout);
    }
    else {
        console.log('Nic nie rób')
        setTimeout(function () { BOT.sign(); }, this.timeout);
    }

}

ARC.Compare = function () {
    let power_arr = [GAME.char_data.sila, GAME.char_data.szyb, GAME.char_data.wytrz];
    let weak_stat = power_arr.indexOf(Math.min(...power_arr)) + 1;

    if (GAME.timed < 2) {
        GAME.socket.emit('ga', { a: 8, type: 2, stat: weak_stat, duration: 12 });
        setTimeout(function () { ARC.Reborn(); }, this.timeout);
    }
    else {
        setTimeout(function () { BOT.sign(); }, this.timeout);
    }


}
ARC.Compare1 = function () {
    let power_arr = [GAME.char_data.sila, GAME.char_data.szyb, GAME.char_data.wytrz,GAME.char_data.moc,GAME.char_data.moc,GAME.char_data.wta];
    let weak_stat = power_arr.indexOf(Math.min(...power_arr)) + 1;

    if (GAME.timed < 2 && GAME.server_rates.trn_rate >= 10) {
        GAME.socket.emit('ga', { a: 8, type: 2, stat: weak_stat, duration: 12, master: 3 });
        setTimeout(function () { ARC.Reborn(); }, this.timeout);
    }

    else if (GAME.timed < 2) {
        GAME.socket.emit('ga', { a: 8, type: 2, stat: weak_stat, duration: 12 });
        setTimeout(function () { ARC.Reborn(); }, this.timeout);
    }
    else if (GAME.timed == 2) {
        setTimeout(function () { BOT.sign(); }, this.timeout);
    }
}
BOT.Start();
