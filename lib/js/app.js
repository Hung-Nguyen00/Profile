//---------------show nav and section--------
(() => {
    const navMenu = document.querySelector('.nav-menu'),
        hamburger = document.querySelector('.hamburger-btn'),
        closeBtn = navMenu.querySelector('.close-nav-menu');
    const fadeOut = document.querySelector('.fade-out-effect');

    hamburger.addEventListener('click', hideSection)
    closeBtn.addEventListener('click', hideNavMenu)

    function hideSection() {
        navMenu.classList.add('open');
        bodyScrollingToggle();
    }

    function hideNavMenu() {
        navMenu.classList.remove('open');
        bodyScrollingToggle();
        fadeOutEffect();

    }

    function fadeOutEffect() {
        fadeOut.classList.add('active');
        setTimeout(() => {
            fadeOut.classList.remove('active');
        }, 500)
    }
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('link-item')) {
            // make sure event.target.hash has a value before overriding default behaviour
            if (e.target.hash !== "") {
                // prevent default anchor click behaviour
                e.preventDefault();
                // assign hash from href (#about)
                const hash = e.target.hash;
                document.querySelector('.section.active').classList.add('hide');
                document.querySelector('.section.active').classList.remove('active');

                document.querySelector(hash).classList.add('active');
                document.querySelector(hash).classList.remove('hide');

                navMenu.querySelector('.active').classList.add('outer-shadow', 'hover-in-shadow');
                navMenu.querySelector('.active').classList.remove('active', 'inner-shadow')
                    // active item is chosen
                if (navMenu.classList.contains('open')) {
                    e.target.classList.add('active', 'inner-shadow');
                    e.target.classList.remove('outer-shadow', 'hover-in-shadow');
                    hideNavMenu();
                } else { //opposite: click button in outside. It still active
                    let navItems = navMenu.querySelectorAll('.link-item');
                    navItems.forEach((item) => {
                        if (hash === item.hash) {
                            item.classList.add('active', 'inner-shadow');
                            item.classList.remove('outer-shadow', 'hover-in-shadow');
                        }
                    })
                    fadeOutEffect();
                }
                // add hash to url
                window.location.hash = hash;
            }
        }
    })
})();



//------------------- tab-content for section------------------
// function active by themself 
(() => {
    const aboutSection = document.querySelector(".about-section"),
        tabsContainer = document.querySelector(".about-tabs");
    tabsContainer.addEventListener("click", (event) => {
        // if event.target contains 'tab-item' class and not contains  'active' class
        if (event.target.classList.contains('tab-item') && !event.target.classList.contains('active')) {

            // deactivate existing a active 'tab-item'
            const target = event.target.getAttribute('data-target'); // take value from DOM (list, experience, education)
            // if active exist .active, let remove it
            tabsContainer.querySelector('.active').classList.remove("outer-shadow", "active");

            // active content
            // active new 'tab-item'
            event.target.classList.add("active", "outer-shadow")
                // deactivate existing active 'tab-content' : content
            aboutSection.querySelector(".tab-content.active").classList.remove("active");
            // activate new tab
            aboutSection.querySelector(target).classList.add("active")
        }
    })
})();

function bodyScrollingToggle() {
    document.body.classList.toggle('stop-scrolling')
}
// ----------------------- portfolio filter and popup-----------------

(() => {
    // declare variable of 'Button' and filter item
    const filterContainer = document.querySelector('.portfolio-filter');
    const portfolioItemsContainer = document.querySelector('.portfolio-items');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // declare variable of Project's detail information
    const popup = document.querySelector('.portfolio-popup');
    const prevBtn = popup.querySelector('.pp-prev');
    const nextBtn = popup.querySelector('.pp-next');
    const closeBtn = popup.querySelector('.pp-close');

    const projectDetailsContainer = popup.querySelector('.pp-details');
    const projectDetailsBtn = popup.querySelector('.pp-project-details-btn');

    let itemIndex, slideIndex, screenshots;

    filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-item') && !e.target.classList.contains('active')) {
                // deactivate existing active 'filter-item'
                filterContainer.querySelector('.active').classList.remove('outer-shadow', 'active');
                // active new 'filter-item'
                e.target.classList.add('outer-shadow', 'active');
                const target = e.target.getAttribute('data-target');

                portfolioItems.forEach((item) => {
                    // if data-category is the same name or is 'all'
                    if (target === item.getAttribute('data-category') || target === 'all') {
                        item.classList.remove('hide')
                        item.classList.add('show');
                    } else {
                        item.classList.remove('show')
                        item.classList.add('hide')
                    }
                })
            }
        })
        // show detail follow itemIndex
    portfolioItemsContainer.addEventListener('click', (e) => {
        // use closest to return and it can return parentElement 
        if (e.target.closest('.portfolio-item-inner')) {
            const portfolioItem = e.target.closest('.portfolio-item-inner').parentElement;
            // get the portfolioItem index
            //portfolioItem.parentElement.children: use to take length of parent Element
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem); // assign Index of portfolioItem from array
            // portfolioItems contains all children
            screenshots = portfolioItems[itemIndex].querySelector('.portfolio-item-img img').getAttribute('data-screenshots');
            // convert screenshots into array
            // split return array
            screenshots = screenshots.split(',');
            if (screenshots.length === 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            }
            // declare slideIndex
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    });

    closeBtn.addEventListener('click', () => {
        popupToggle();
    })

    function popupToggle() {
        popup.classList.toggle('open');
        bodyScrollingToggle();
    }
    // popupDetails
    function popupDetails() {
        // get the project details

        // if details of item don't exist, projectDetailsBtn is none
        if (!portfolioItems[itemIndex].querySelector('portfolio-item-details')) {
            projectDetailsBtn.style.display = 'none';
        }
        projectDetailsBtn.style.display = 'block';

        // get info from Item to popup
        const details = portfolioItems[itemIndex].querySelector('.portfolio-item-details').innerHTML;
        popup.querySelector('.pp-project-details').innerHTML = details;

        const title = portfolioItems[itemIndex].querySelector('.portfolio-item-titile').innerHTML;
        popup.querySelector('.pp-title h2').innerHTML = title;

        const category = portfolioItems[itemIndex].getAttribute('data-category')
        popup.querySelector('.pp-project-category').innerHTML = category;

        // const info = portfolioItems[itemIndex].querySelector('.portfolio-item-details .info').innerHTML

        // popup.querySelector('.info').innerHTML = info;

    }


    // slide show follow slideIndex
    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector('.pp-img');
        // activate loader until the popupImg loaded;
        popup.querySelector('.pp-loaded').classList.add('active');
        // access address of img
        popupImg.src = imgSrc;
        popupImg.onload = () => {
            popup.querySelector('.pp-loaded').classList.remove('active');
        }
        popup.querySelector('.pp-counter').innerHTML = (slideIndex + 1) + ' of ' + screenshots.length;
    }

    //----------------------
    // next slide
    nextBtn.addEventListener('click', () => {
        if (slideIndex === screenshots.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        popupSlideshow();
    })

    // prev slide
    prevBtn.addEventListener('click', () => {
        if (slideIndex === 0) {
            slideIndex = screenshots.length - 1;
        } else {
            slideIndex--;
        }
        popupSlideshow();
    })

    // show detail information project

    projectDetailsBtn.addEventListener('click', () => {
        popupDetailToggle();
    })

    function popupDetailToggle() {
        if (projectDetailsContainer.classList.contains('active')) {
            projectDetailsBtn.querySelector('i').classList.add('fa-plus');
            projectDetailsBtn.querySelector('i').classList.remove('fa-minus');
            projectDetailsContainer.classList.remove('active');
            projectDetailsContainer.style.maxHeight = 0 + 'px';
        } else {
            projectDetailsBtn.querySelector('i').classList.remove('fa-plus');
            projectDetailsBtn.querySelector('i').classList.add('fa-minus');
            projectDetailsContainer.classList.add('active');
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + 'px';
        }
    }
})();

// -------------------testimonial slider--------------

(() => {
    const sliderContainer = document.querySelector('.testi-slider-container');
    const slides = sliderContainer.querySelectorAll('.testi-item');
    const slideWidth = sliderContainer.offsetWidth,
        activeSlide = document.querySelector('.testi-item.active');
    const prevBtn = document.querySelector('.testi-slider-nav .prev'),
        nextBtn = document.querySelector('.testi-slider-nav .next');
    const sectionTestimonial = document.querySelector('.testimonial-section')
    let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);

    // assign width to item
    // slides.forEach((slide) => {
    //     slide.style.width = slideWidth + 'px';
    // })

    // get length of all item and display: flex
    sliderContainer.style.width = slideWidth * slides.length + 'px';

    nextBtn.addEventListener('click', () => {
        if (slideIndex === slides.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        slider();
    })
    prevBtn.addEventListener('click', () => {
        if (slideIndex === 0) {
            slideIndex = slides.length - 1;
        } else {
            slideIndex--;
        }
        slider();
    })

    function slider() {
        sliderContainer.querySelector('.testi-item.active').classList.remove('active');
        slides[slideIndex].classList.add('active')
        sliderContainer.style.marginLeft = -(slideWidth * slideIndex) + 'px';
    }
    slider();
})();

(() => {

    // add hide to section when window load
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
        if (!section.classList.contains('active')) {
            section.classList.add('hide');
        }
    })
})();

window.addEventListener('load', () => {
    document.querySelector('.preloader').classList.add('fade-out')
    setTimeout(() => {
        document.querySelector('.preloader').style.display = 'none';
    }, 600)
})