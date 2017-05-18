/* feedreader.js
 *
 * 这是 Jasmine 会读取的spec文件，它包含所有的要在你应用上面运行的测试。
 */

/* 我们把所有的测试都放在了 $() 函数里面。因为有些测试需要 DOM 元素。
 * 我们得保证在 DOM 准备好之前他们不会被运行。
 */
$(function() {
    /* 这是我们第一个测试用例 - 其中包含了一定数量的测试。这个用例的测试
     * 都是关于 Rss 源的定义的，也就是应用中的 allFeeds 变量。
     */
    describe('RSS Feeds', function() {
        /* 这是我们的第一个测试 - 它用来保证 allFeeds 变量被定义了而且
         * 不是空的。在你开始做这个项目剩下的工作之前最好实验一下这个测试
         * 比如你把 app.js 里面的 allFeeds 变量变成一个空的数组然后刷新
         * 页面看看会发生什么。
         */
        it('are defined', function() {
            // 测试用例，测试 allFeeds 有没有定义过
            expect(allFeeds).toBeDefined();
            // 测试用例，测试 allFeeds 是否为空
            expect(allFeeds.length).not.toBe(0);
        });

        /*
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有名字字段而且不是空的。
         */
        it('names are defined', function() {
            var FeedName = true;
            // 遍历元素，检查是否有包含无效名称的条目
            for (var i = 0, len = allFeeds.length; i < len; i++) {
                if (!$.trim(allFeeds[i].name) && typeof allFeeds[i].name === 'string') {
                    FeedName = false;
                    break;
                }
            }
            expect(FeedName).toBe(true);
        });

        /* 
         * 编写一个测试遍历 allFeeds 对象里面的所有的源来保证有链接字段而且链接不是空的。
         */
        it('urls are defined', function() {
            var FeedUrl = true;
            // 遍历元素，检查是否有包含无效链接地址的条目
            for (var i = 0, len = allFeeds.length; i < len; i++) {
                if (!$.trim(allFeeds[i].url) && typeof allFeeds[i].url === 'string') {
                    FeedUrl = false;
                    break;
                }
            }
            expect(FeedUrl).toBe(true);
        });

    });


    /* 写一个叫做 "The menu" 的测试用例 */
    describe('The menu', function() {
        var sideMenu,
            transLeft,
            hasHiddenClass,
            onMenuHidden,
            onMenuVisible;
        // 前置变量及方法,用来检测元素是否包含相应的class以及菜单位移
        beforeEach(function() {
                sideMenu = $('.slide-menu');
                // matrix 对象第4个下标代表向左位移的距离，这里应该等于sideMenu的总宽度，以实现菜单的隐藏 
                // 是否含有 menu-hidden class
                hasHiddenClass = function() {
                    return $('body').hasClass('menu-hidden');
                };
                // 菜单是否正常隐藏
                // 检测菜单的左偏移距离是否等于菜单总宽度
                onMenuHidden = function() {
                    transLeft = sideMenu.css('transform').split(',');
                    return parseInt(transLeft[4]) === -sideMenu.outerWidth();
                };
                // 菜单是否正常显示 
                // 检测菜单的左偏移距离是否等于0
                onMenuVisible = function() {
                    transLeft = sideMenu.css('transform').split(',');
                    return parseInt(transLeft[4]) === 0
                };
            })
            /* 
             * 写一个测试用例保证菜单元素默认是隐藏的。
             * 应用通过给body 添加和移除 menu_hidden 来达到隐藏和显示菜单的作用
             * 当body有 menu_hidden 样式的时候，菜单向左位移，移动到屏幕显示区域外，以达到菜单隐藏的效果
             */
        it('should be hidden', function() {
            // 当 body 含有 menu_hidden 且 菜单在屏幕可视区域外
            expect(hasHiddenClass() && onMenuHidden()).toBe(true);
        });

        /* 
         * 写一个测试用例保证当菜单图标被点击的时候菜单会切换可见状态。这个
         * 测试应该包含两个 expectation ： 党点击图标的时候菜单是否显示，
         * 再次点击的时候是否隐藏。
         */
        it('should can toggle visible', function(done) {
            var menuIcon = $('.menu-icon-link');
            // 触发点击事件
            menuIcon.trigger('click');
            // 点击之后应该显示 ,因为 sideMenu 动画效果有200ms的执行时间 所以这里需要等待动画完成
            setTimeout(function() {
                expect(!hasHiddenClass() && onMenuVisible()).toBe(true);
                // 再次点击应该显示 
                menuIcon.trigger('click');
                setTimeout(function() {
                    expect(hasHiddenClass() && onMenuHidden()).toBe(true);
                    done();
                }, 250);
            }, 250);
        });

    });

    /* 13. 写一个叫做 "Initial Entries" 的测试用例 */
    describe('Initial Entries', function() {
        var feedContainer,
            entries;

        // 保存容器对象
        beforeEach(function() {
            feedContainer = $('.feed');
        });

        /* 
         * 写一个测试保证 loadFeed 函数被调用而且工作正常，即在 .feed 容器元素
         * 里面至少有一个 .entry 的元素。
         *
         * loadFeed() 函数是异步的所以这个而是应该使用 Jasmine 的 beforeEach
         * 和异步的 done() 函数。
         */
        it('loadFeed should work', function(done) {
            loadFeed(0, function() {
                entries = feedContainer.find('.entry');
                // 判断其是否包含 .entry 元素
                expect(entries.length > 0).toBe(true);
                done();
            });
        });
    });

    /* 写一个叫做 "New Feed Selection" 的测试用例 */
    describe('New Feed Selection', function() {
        var oldSource, newSource;

        // 保存之前的内容，以便后续做比较
        beforeEach(function() {
            oldSource = $('.feed').find('.entry');
        });

        /*
         * 写一个测试保证当用 loadFeed 函数加载一个新源的时候内容会真的改变。
         * loadFeed() 函数是异步的。
         */
        it('should load new source', function(done) {
            loadFeed(1, function() {
                newSource = $('.feed').find('.entry');
                // 对比旧内容的第一条 entry html是否和 新内容第一条entry相同，以判断其内容有没有更新
                expect(newSource[0].outerHTML === oldSource[0].outerHTML).toBe(false);
                done();
            });
        })
    });
}());