(function () {
    var activeScrollingEvent = false;
    var currentBlogPage = parseInt(localStorage.getItem('activeBlog'));

    if (!currentBlogPage) {
        currentBlogPage = 1;
        localStorage.setItem('activeBlog', 1);
    }

    function createNavigationTabs() {
        var blogNum = document.getElementsByClassName('blog-container').length;

        for (var i = 0; i < blogNum; i++) {
            var newBlogTab = document.createElement('i');

            if ((i + 1) == currentBlogPage) {
                newBlogTab.classList = "blog-tab active-blog fa-solid fa-star text-lg";
            } else {
                newBlogTab.classList = "blog-tab fa-regular fa-star text-lg";
            }

            newBlogTab.id = "blog-tab-" + (i + 1);

            document.getElementsByClassName('side-navigation')[0].appendChild(newBlogTab);
        }

    }

    function selectBlogPage(pageNum) {
        if (pageNum == currentBlogPage) {
            return;
        }

        if (!!pageNum) {
            currentBlogPage = pageNum;
        }

        var blogNum = document.getElementsByClassName('blog-container').length;

        /*
            Font awesome converts the icons to svg for quality. Unfortunately this means we cannot
            just change the class on the element to get the element to change. We remove the the previous 
            set and insert new ones.
        */
        for (var ab = (blogNum - 1); ab >= 0; ab--) {
            var blogTab = document.getElementsByClassName('blog-tab')[ab];
            blogTab.remove();
        }

        for (var cd = 0; cd < blogNum; cd++) {
            var newBlogTab = document.createElement('i');

            if ((cd + 1) == currentBlogPage) {
                newBlogTab.classList = "blog-tab active-blog fa-solid fa-star text-lg";
            } else {
                newBlogTab.classList = "blog-tab fa-regular fa-star text-lg";
            }

            newBlogTab.id = "blog-tab-" + (cd + 1);

            document.getElementsByClassName('side-navigation')[0].appendChild(newBlogTab);
        }

        bindSideNavigation();

        for (var i = 0; i < blogNum; i++) {
            var blogContainer = document.getElementsByClassName('blog-container')[i];

            if ((i + 1) == currentBlogPage) {
                blogContainer.style.display = '';
            } else {
                blogContainer.style.display = 'none';
            }
        }

        localStorage.setItem('activeBlog', currentBlogPage);
    }

    function onScroll(event) {
        if (!!activeScrollingEvent) {
            return;
        }
        activeScrollingEvent = true;

        var blogNum = document.getElementsByClassName('blog-container').length;
        /*
            UP else DOWN
        */

        var nextBlogPage = currentBlogPage;

        if (event.wheelDeltaY > 0) {
            /* 
                If the user is on the first page, don't allow further scrolling up.
                However, if they are on the last page then loop back to the first.
            */
            if (nextBlogPage != 1) {
                nextBlogPage -= 1;
            } else {
                activeScrollingEvent = false;
                return;
            }
        } else {
            if (nextBlogPage != blogNum) {
                nextBlogPage += 1;
            } else {
                nextBlogPage = 1;
            }
        }

        selectBlogPage(nextBlogPage);

        activeScrollingEvent = false;
    }

    function tabOnClick(event) {
        var target = event.target.nodeName == 'path' ? event.target.parentNode : event.target;
        var page = parseInt(target.id.split('-')[2]);

        selectBlogPage(page);
    }

    function bindSideNavigation() {
        document.removeEventListener('wheel', onScroll);
        document.addEventListener("wheel", onScroll);

        FontAwesome.dom.i2svg().then(function () {
            for (var i = 0; i < document.getElementsByClassName('blog-tab').length; i++) {
                document.getElementsByClassName('blog-tab')[i].addEventListener('click', tabOnClick);
            }
        });
    }

    /*
        Init
    */
    document.addEventListener('DOMContentLoaded', function () {
        createNavigationTabs();
        selectBlogPage();
        bindSideNavigation();
    }, false);
})();