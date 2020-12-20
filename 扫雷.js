// 扫雷游戏程序整体框架
// 1，核心
// （1）核心规则：翻开一个格子，显示相应数字。以3*3格子为最小单位，一个格子显示的数字代表其周围的雷数。
//              如翻开是雷的格子，则游戏结束；如把除雷以外的格子都翻开了，则游戏胜利
// （2）核心思路：以二维数组（均为0-9的数字）来储存扫雷时所需要的数据，0代表周围没有雷，9代表雷，其余数字代表其本身周围有几个9（雷）
// （3）核心算法：关联算法（具体：在一个二维数组中，根据某一个元素为中心和3*3格子的游戏规则，来关联周围8个元素，标记功能和再判断功能）
//
// 2，需要的主要算法：
// （1）生成二维随机数组
//      输入（阶数n，雷数boom）  输出（一个随机带boom个9，其余均为0的n阶二维数组）
// （2）根据3*3规则，标记二维数组
//      输入（一个二维随机数组）  输出（标记好的二维随机数组）
// （3）根据二维数组，画格子
//      输入（一个标记好的二维随机数组）  输出（页面布局为n*n的格子，每一个格子包含对应的数字，数字默认隐藏）
// （4）判断点击事件
//      输入（点击某一个格子）  输出（根据不同的情况：
//                                 如点击到包含9的格子，则显示数字，游戏失败；
//                                 如点击包含非0非9的其余数字的格子，则翻开该格子；
//                                 如点击包含0的格子，则翻开该格子，对周围8个格子每一个都进行隐式判断：
//                                      如为非0非9格子，则翻开该格子；
//                                      如为含9的格子，则不翻开该格子；
//                                      如为含0的格子，则翻开该格子，并以点击到该格子为前提，重复进行以上步骤
//                              ）
// （5）判断游戏是否胜利
//      输入（点击完成后）  输出（根据不同情况：
//                                 如点击完成后，除了含雷格子以外，还有其余格子没有翻开，则不进行任何操作
//                                 如点击完成后，除了含雷格子以外，其余格子都翻开了，则游戏胜利）
//
// 3，附加功能：
//      （1）游戏胜利与游戏失败的页面显示，自定义提示框
//      （2）点击一个按钮，根据输入的阶数n与雷数boom，重新开始游戏
//      （3）鼠标滑动到格子上时，格子颜色变化，滑出时，格子颜色复原
//      （4）标记雷，需要同时按下a与点击格子，在该格子上显示标记；取消标记雷，再点一次格子
//
// 4，需要的样式
// （1）将显示的9替换为显示雷图片
// （2）显示的标记图片
// （3）阶数与雷数的输入框
// （4）整体布局（框架样式，格子样式，提示框样式，按钮样式）


// 算法（1） 生成二维随机数组
//   输入（阶数n，雷数boom）  输出（一个随机带boom个9，其余均为0的n阶二维数组）
//   最终实现函数为 randomArrayTwo(n, boom)

// 1，生成有n个0元素的数组
const beginArray = function (n){
    let s =[]
    for (let i = 0; i < n; i++) {
        s.push(0)
    }
    return s
}

// 2，生成一个随机一维数组randoms，含有含boom个不重复的从 0——n*n 的元素
const Randoms = function (n, boom) {
    let total = n * n
    let randoms = []
    // 循环生成 0——n*n 的随机数放入数组randoms，
    // 判断生成的随机数字里是否有相同的，如果不相同才传入，如果有相同的则继续生成，直至元素个数等于boom
    while (randoms.length < boom) {
        let random = parseInt(Math.random() * total, 10)
        if (!randoms.includes(random)) {
            randoms.push(random)
        }
    }
    return randoms
}

// 3，根据randoms和n，遍历randoms，生成对于9位置的随机数组s，
//    即让 s[randoms[i]] = 9 ，将得到 s = [0,9,0,9,0,0,0,0,9，...] 这样的随机9位置的数组
const randomsArray = function (n, randoms) {
    let s = beginArray(n * n)
    for (let i = 0; i < randoms.length; i++) {
        let random = randoms[i]
        s[`${random}`] = 9
    }
    return s
}

// 4，将s转换为S，生成二维数组S
const randomArrayTwo = function (n, boom) {
    let randoms = Randoms(n, boom)
    let s = randomsArray(n, randoms)
    let S = []
    for (let i = 0; i < s.length; i = i + n) {
        let begin = i
        let end = i + n
        S.push(s.slice(begin, end))
    }
    return S
}



// 算法（2） 根据3*3规则，标记二维数组
//   输入（一个二维随机数组）  输出（标记好的二维随机数组）
//   最终实现函数为 markedSquare(array)

// 1，复制二维数组
const clonedSquare = function(array) {
    // array 是一个二维数组, 即 array 的每一个元素依然是一个数组
    // 把 array 的每一个数组元素的元素复制到另一个新数组
    // 返回新数组
    // 提示: 遍历 array, 复制每一个元素到新数组即可
    let l = []
    for (let i = 0; i < array.length; i++) {
        let line = array[i]
        let c = line.slice(0)
        l.push(c)
    }
    return l
}

// 2，对一个（x，y）格子的对应的数字+1（在符合边界条件下）
const plus1 = function(array, x, y) {
    // 1. array[x][y] 不能是 9
    // x 和 y 满足下标条件(不越界)
    let l = array.length
    if (x >= 0 && x < l && y >= 0 && y < l) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

// 3，对（x,y）周围的8个坐标都进行+1（在满足（x, y）为9的条件下）
const markAround = function(array, x, y) {
    if (array[x][y] === 9) {
        // 先标记左边 3 个
        plus1(array, x - 1, y - 1)
        plus1(array, x, y - 1)
        plus1(array, x + 1, y - 1)

        // 再标记上下 2 个
        plus1(array, x - 1, y)
        plus1(array, x + 1, y)

        // 再标记右边 3 个
        plus1(array, x - 1, y + 1)
        plus1(array, x, y + 1)
        plus1(array, x + 1, y + 1)
    }
}

// 4，复制二维数组，遍历复制后的二维数组，进行标记，然后返回标记好的二维数组
const markedSquare = function(array) {
    let square = clonedSquare(array)
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        for (let j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    return square
}



// 算法（3） 根据二维数组，画格子
//      输入（一个标记好的二维随机数组）  输出（页面布局为n*n的格子，每一个格子包含对应的数字，数字默认隐藏）
//      最终实现函数为renderSquare(square)

// 1，根据一行的一维数组，以及其对应的 x，输出 这一行的 html 格子
const templateCell = function(line, x) {
    let s = ''
    for (let i = 0; i < line.length; i++) {
        let number = line[i]
        s += `<div class="cell" data-number="${number}" data-x="${x}" data-y="${i}">${number}</div>`
    }
    return s

}

// 2，遍历二维数组，输出其对应的所有的 html 格子
const templateRow = function(square) {
    let s = ''
    for (let i = 0; i < square.length; i++) {
        let s1 = templateCell(square[i], i)
        s += `<div class="row clearfix">${s1}</div>`
    }
    return s
}

// 3，根据二维数组，得到对应的所有html格子后，插入到页面中（插入到<div id="id-div-mime"></div>）
const renderSquare = function(square) {
    let container = e('#id-div-mime')
    container.innerHTML = templateRow(square)
}



// 算法（4） 判断点击事件（绑定）
//      输入（点击某一个格子）  输出（根据不同的情况：
//                                 如点击到包含9的格子，则显示数字，游戏失败；
//                                 如点击包含非0非9的其余数字的格子，则翻开该格子；
//                                 如点击包含0的格子，则翻开该格子，对周围8个格子每一个都进行隐式判断：
//                                      如为非0非9格子，则翻开该格子；
//                                      如为含9的格子，则不翻开该格子；
//                                      如为含0的格子，则翻开该格子，并以点击到该格子为前提，重复进行以上步骤
//                              ）
//      最终实现函数为 bindEventCell 函数

// 1，用事件委托的方式在父元素上面绑定 click 事件, 对格子进行处理
// 如果点击的是 .cell 元素, 那么调用 logic 函数（对于格子进行一系列处理）
// 附加功能：如果点击的同时按下了‘a’ 键，则调用 tagEvent 函数，在格子上添加标记
const bindEventCell = function(n, boom, square) {
    let container = e('#id-div-mime')
    bindEvent(container, 'click', function (event) {
        let self = event.target
        if (self.classList.contains('cell')) {
            logic(n, boom, self, square)
        }
    })
}

// 2，判断点击情况，分为9，0，其他数字
// 点击到9：调用 boomAll0pen 函数，将所有雷都显示出来，再调用 alert_Lose 函数，显示游戏失败
// 点击到0：按照0方式翻开这个0，调用 ifWin 函数（判断游戏是否胜利），再调用 cellAround 函数(处理周围情况）
// 点击到其他数字，翻开这个数字，调用 ifWin 函数（判断游戏是否胜利）
const logic = function(n, boom, cell, square) {
    let number = parseInt(cell.dataset.number, 10)
    if (number === 9) {
        boomAll0pen()
        alert_Lose()
    } else if (number === 0) {
        let x = Number(cell.dataset.x)
        let y = Number(cell.dataset.y)
        cell.classList.add('opened-0')
        ifWin(n, boom)
        cellAround(n, boom, square, x, y)
    } else {
        cell.classList.add('opened')
        ifWin(n, boom)
    }
}

// 给所有地雷cell中增加地雷图片
const boomAll0pen = function () {
    let booms = es(`[data-number='9']`)
    for (let i = 0; i < booms.length; i++) {
        let boom = booms[i]
        boom.classList.add('opened-boom')
        appendHtml(boom, `<img id="id-boom-image" src="boom.png">`)
    }
}

// 3，处理(x, y)坐标周围8个坐标的情况，依次将坐标输入到 judgeOpen 函数中
const cellAround = function(n, boom, square, x, y) {
    // 处理上面三个
    judgeOpen(n, boom, square, x - 1, y - 1)
    judgeOpen(n, boom, square, x - 1, y)
    judgeOpen(n, boom, square, x - 1, y + 1)

    // 处理左右两个
    judgeOpen(n, boom, square, x, y - 1)
    judgeOpen(n, boom, square, x, y + 1)

    // 处理下面三个
    judgeOpen(n, boom, square, x + 1, y - 1)
    judgeOpen(n, boom, square, x + 1, y)
    judgeOpen(n, boom, square, x + 1, y + 1)
}

// 4，判断一个格子的情况
// 如果满足边界条件和满足格子未被打开的条件，则获取格子的数字值，进行判断，分为0，9，其他数字
//   如果数字为0，则按照0的方式翻开这个格子，调用 ifWin 函数（判断游戏是否胜利），再调用 cellAround 函数（递归，再进行情况为0时的处理方式）
//   如果数字为其他数字，则翻开这个格子
//   如果数字为9，则不用翻开
const judgeOpen = function(n, boom, square, x, y) {
    let l = square.length
    if (x >= 0 && x < l && y >= 0 && y < l) {
        let cell = e(`[data-x='${x}'][data-y='${y}']`)
        if (!cell.classList.contains('opened') && !cell.classList.contains('opened-0')) {
            let number = Number(cell.dataset.number)
            if (number === 0) {
                cell.classList.add('opened-0')
                ifWin(n, boom)
                cellAround(n, boom, square, x, y)
            } else if (number !== 9) {
                cell.classList.add('opened')
                ifWin(n, boom)
            }
        }
    }
}



// 算法（5） 判断游戏是否胜利
//      输入（点击完成后）  输出（根据不同情况：
//                                 如点击完成后，除了含雷格子以外，还有其余格子没有翻开，则不进行任何操作
//                                 如点击完成后，除了含雷格子以外，其余格子都翻开了，则游戏胜利）
const ifWin = function (n, boom) {
    let should = n * n - boom
    let opened_0 = document.querySelectorAll('.opened-0')
    let opened = document.querySelectorAll('.opened')
    let opened_all = opened_0.length + opened.length
    if (opened_all === should) {
        alert_Win()
    }
}



// 附加功能

// 1，游戏胜利与游戏失败的页面显示，自定义提示框

// （1）向页面添加html内容
const addhtml = function (alert) {
    let t1 = ''
    let t2 = ''
    if (alert === 'win') {
        t1 = '你赢了！真厉害啊！'
        t2 = '知道啦！'
    } else {
        t1 = '哎呀！点到雷了！ 继续加油哦！'
        t2 = '知道啦！'
    }
    let t = `<div class="body-alert">
            <div class="title-alert">
               ${t1}
            </div>
            <button class="button-alert">
               ${t2}
            </button>
          </div>`
    let body = document.querySelector('body')
    body.insertAdjacentHTML('beforeend', t)
}

// （2）游戏胜利的页面显示与按钮功能
const alert_Win = function () {
    addhtml('win')
    let body = document.querySelector('#id-body')
    body.classList.add('hide')

    let button = document.querySelector('.button-alert')
    bindEvent(button, 'click', function () {
        let a = document.querySelector('.body-alert')
        a.remove()
        body.classList.remove('hide')
    })
}

// （2）游戏失败的页面显示与按钮功能
const alert_Lose = function () {
    addhtml('lose')
    let body = document.querySelector('#id-body')
    body.classList.add('hide')

    let button = document.querySelector('.button-alert')
    bindEvent(button, 'click', function () {
        let a = document.querySelector('.body-alert')
        a.remove()
        body.classList.remove('hide')
    })
}



// 2，点击一个‘开始游戏’按钮，根据输入的阶数n与雷数boom，重新开始游戏

// 根据输入框的n与bomm，生成新的随机的标记好的二维数组
const newSquare = function () {
    // 获取阶数n
    let input_n = e('#id-n')
    let n = parseInt(input_n.value, 10)
    // 获取雷数boom
    let input_boom = e('#id-boom')
    let boom = parseInt(input_boom.value, 10)
    // 得到新数组
    let S_New = randomArrayTwo(n, boom)
    let square_New = markedSquare(S_New)
    return square_New
}

// 删除与新建'#id-div-mime'（目的：不会重复绑定）
const newDiv = function () {
    // 删除'#id-div-mime'
    let mimes = es('#id-div-mime')
    for (let i = 0; i < mimes.length; i++) {
        let mime = mimes[i]
        mime.remove()
    }
    // 新建'#id-div-mime'
    let body = e('#id-body')
    body.insertAdjacentHTML('beforeend', '<div id="id-div-mime"></div>')
}

// 获取新的数组，生成新的页面，重新绑定对应的事件
const newGame =function () {
    // 画出总的扫雷图，绑定好各个事件
    let square = newSquare()
    // 获取阶数n
    let input_n = e('#id-n')
    let n = Number(input_n.value)
    // 获取雷数boom
    let input_boom = e('#id-boom')
    let boom = Number(input_boom.value)

    renderSquare(square)
    bindEventCell(n, boom, square)
    bindMose()
    bindTag()
}

// 在‘开始游戏’按钮上绑定事件，调用 newDiv 与 newGame 函数
const bindEventRegame = function () {
    let regame = e('.regame')
    bindEvent(regame, 'click', function () {
        newDiv()
        newGame()
    })
}



// 3，鼠标滑动到格子上时，格子颜色变化，滑出时，格子颜色复原

//（1）在父元素上绑定 mouseover 事件，格子颜色变化
const bindMouseOver = function () {
    let container = e('#id-body')
    bindEvent(container, 'mouseover', function (event) {
        let self = event.target
        if (self.classList.contains('cell') || self.classList.contains('regame') || self.classList.contains('input')) {
            self.classList.add('mouseover')
        }
    })

}

//（2）在父元素上绑定 mouseout 事件，格子颜色还原
const bindMouseOut = function () {
    let container = e('#id-body')
    bindEvent(container, 'mouseout', function (event) {
        let self = event.target
        if (self.classList.contains('cell') || self.classList.contains('regame') || self.classList.contains('input')) {
            self.classList.remove('mouseover')
        }
    })
}

//（3）将 mouseover 函数与 mouseout 函数 合并
const bindMose = function () {
    bindMouseOver()
    bindMouseOut()
}



// 4，标记雷，鼠标右键点击格子，在该格子上显示标记；取消标记雷，再点一次格子

// 用事件委托的方式，在格子上绑定'contextmenu'
const bindTag = function () {
    let container = e('#id-div-mime')
    // 在格子范围内取消右点出现的菜单栏
    function stop() {
        return false;
    }
    container.oncontextmenu = stop
    bindEvent(container, 'contextmenu', function (event) {
        let self = event.target
        if (self.classList.contains('cell')) {
            tagEvent(self)
        }
    })
}

// 在格子里加入标记图片，并且绑定事件，如果点击到图片，则删除图片
const tagEvent = function (self) {
    appendHtml(self,`<img class="tag-image" src="tag.png">`)
    let image = self.querySelector('.tag-image')
    bindEvent(image, 'contextmenu', function () {
        image.remove()
    })
}




// 初始游戏页面的函数入口
const bindEvents = function () {
    bindEventRegame()
    bindMose()
    bindTag()
}

const __main = function () {
    let square = newSquare()
    renderSquare(square)
    bindEventCell(10,10, square)
    bindEvents()

}

__main()

