import $ from 'jquery';

$(document).on("click","[data-password]", function(e) 
{
    if($(this).attr("data-password") === "false")
    {
        $(this).siblings("input").attr("type", "text");
        $(this).attr("data-password", "true");
        $(this).addClass("show-password")
    } 
    else
    {
        $(this).siblings("input").attr("type", "password");
        $(this).attr("data-password", "false");
        $(this).removeClass("show-password")
    };
});
$(document).on("click", "[data-location]", function (t) 
{
    $("body").removeClass("end-bar-enabled");
    $("body").removeClass("sidebar-enable");
})

$(document).on("click", ".button-menu-mobile", function(t) {
    t.preventDefault();
    $('body').toggleClass("sidebar-enable");
    if(750 <= $(window).width())
    {
        if("condensed" === $('body').attr("data-leftbar-compact-mode"))
        {
            $('body').removeAttr("data-leftbar-compact-mode");
        }
        else
        {
            $('body').attr("data-leftbar-compact-mode", "condensed");
        }
    } 
})