$(document).ready(function(){

    const textEn = '"Where Craft Meets Vision"';
    const textKo = "[장인의 손끝에서 시각의 본질로]";
    const typingSpeed = 80;
    const pauseBetween = 1000;
    const pauseAfterTyping = 3000; // 한글 타이핑 후 대기

    function typeWithCursor($textTarget, $cursor, text, onDone, finalLoop = false) {
        let index = 0;
        $textTarget.text('');
        $cursor.css("visibility", "visible");

        function type() {
            if (index <= text.length) {
                $textTarget.text(text.substring(0, index));
                index++;
                setTimeout(type, typingSpeed);
            } else {
                $textTarget.text(text);
                if (!finalLoop) {
                $cursor.css("visibility", "hidden"); // 중간 단계일 땐 숨김
                } else {
                $cursor.css("visibility", "visible"); // 마지막 커서 유지
                }
                if (onDone) setTimeout(onDone, pauseBetween);
            }
        }

        type();
    }

    function startTypingLoop() {
        // 초기화
        $("#typing-en-text, #typing-ko-text").text('');
        $("#cursor-en, #cursor-ko").css("visibility", "hidden");

        // 단계 1: 영문 타이핑
        typeWithCursor($("#typing-en-text"), $("#cursor-en"), textEn, function () {
        // 단계 2: 한글 타이핑 (마지막 단계 → 커서 유지)
        typeWithCursor($("#typing-ko-text"), $("#cursor-ko"), textKo, function () {
            // 단계 3: 한글 끝난 후에도 커서는 유지되며 일정 시간 후 루프 반복
            setTimeout(startTypingLoop, pauseAfterTyping);
        }, true); // ← 마지막 단계
        });
    }

    startTypingLoop()

    $('#menu-toggle').on('click', function () {
        $(this).toggleClass('active');
        $('#modal-menu').toggleClass('active');
        $('#modal-overlay').toggleClass('active');
        // $('.typing-section').toggleClass('hidden');

        const isOpen = $('#modal-menu').hasClass('active');
        if (isOpen) {
            $('body').addClass('modal-open');
            $('#typing-en-text, #typing-ko-text').hide();
        } else {
            $('body').removeClass('modal-open');
            $('#typing-en-text, #typing-ko-text').show();
        }
    });

    const $text = $('.text-slide p');
    const slideWidth = $('.text-slide').width();
    let x = -$text.width();

    function slide() {
        x += 1; // 속도 조절: 1px per frame
        if (x > slideWidth) {
            x = -$text.width(); // 다시 왼쪽에서 시작
        }
        $text.css('transform', `translateX(${x}px)`);
        requestAnimationFrame(slide);
    }

    slide(); // 시작

    function initFixedSlider(selector, slideWidth = 650) {
        const $slider = $(selector);
        const $container = $slider.find('.slides');
        const $slides = $container.children('img');
        const slideCount = $slides.length;
        let currentIndex = 1;
        let isAnimating = false;
        let startX = 0;
        let currentX = 0;

        // ✅ Clone first & last
        const $firstClone = $slides.first().clone();
        const $lastClone = $slides.last().clone();
        $container.prepend($lastClone);
        $container.append($firstClone);

        const totalSlides = slideCount + 2;
        const totalWidth = totalSlides * slideWidth;

        $container.css({
            width: `${totalWidth}px`,
            transform: `translateX(-${slideWidth * currentIndex}px)`
        });

        $container.children().css({
            width: `${slideWidth}px`,
            height: '100%',
            flex: '0 0 auto'
        });

        // ✅ Pagination
        const $pagination = $slider.find('.pagination');
        $pagination.empty();
        for (let i = 0; i < slideCount; i++) {
            $pagination.append(`<span data-index="${i}"></span>`);
        }
        $pagination.find('span').eq(0).addClass('active');

        function updatePagination(index) {
            const realIndex = (index - 1 + slideCount) % slideCount;
            $pagination.find('span').removeClass('active');
            $pagination.find(`span[data-index=${realIndex}]`).addClass('active');
        }

        function goToSlide(index) {
            if (isAnimating) return;
            isAnimating = true;
            currentIndex = index;

            $container.css({
            transition: 'transform 0.4s ease',
            transform: `translateX(-${slideWidth * index}px)`
            });

            setTimeout(() => {
            if (currentIndex === 0) {
                $container.css('transition', 'none');
                currentIndex = slideCount;
                $container.css('transform', `translateX(-${slideWidth * currentIndex}px)`);
            } else if (currentIndex === slideCount + 1) {
                $container.css('transition', 'none');
                currentIndex = 1;
                $container.css('transform', `translateX(-${slideWidth * currentIndex}px)`);
            }
            updatePagination(currentIndex);
            isAnimating = false;
            }, 450);
        }

        // ✅ Navigation arrows
        $slider.find('.nav.next').on('click', () => goToSlide(currentIndex + 1));
        $slider.find('.nav.prev').on('click', () => goToSlide(currentIndex - 1));

        // ✅ Pagination click
        $pagination.on('click', 'span', function () {
            const index = Number($(this).attr('data-index'));
            goToSlide(index + 1);
        });

        // ✅ Swipe
        $slider.on('mousedown touchstart', function (e) {
            startX = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX;
        });

        $slider.on('mouseup touchend', function (e) {
            currentX = e.type === 'touchend' ? e.originalEvent.changedTouches[0].clientX : e.clientX;
            const diff = currentX - startX;

            if (diff > 50) {
            goToSlide(currentIndex - 1);
            } else if (diff < -50) {
            goToSlide(currentIndex + 1);
            }
        });
    }

        // ✅ 적용 예시
    $(document).ready(function () {
        initFixedSlider('.machine-slider');
        initFixedSlider('.cradle-slider');
        initFixedSlider('.case-slider');
        initFixedSlider('.grip-slider');
    });
});