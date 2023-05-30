function getIcon(title) {
    let icon = ""
    if (title && title.includes('Web') && title.includes('Mobile')) {
        icon = '<img src="../../images/web_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;"/><img src="../../images/mobile_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;" class="option-icon">';
    } else if (title && ((title.includes('iOS') && title.includes('Android')) || title.includes('Mobile'))) {
    icon = '<img src="../../images/mobile_16_icon.png" style="width: 1rem; height: 1rem; vertical-align: bottom;" class="option-icon">';
    } else if (title && title.includes('Web')) {
    icon = '<img src="../../images/web_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;" class="option-icon">';
    }else if (title && title.includes('API')) {
    icon = '<img src="../../images/api_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;" class="option-icon">';
    } else if (title && title.includes('Android')) {
    icon = '<img src="../../images/android_16_icon.png" style="width: 1rem; height: 1rem; vertical-align: top;" class="option-icon">';
    } else if (title && title.includes('iOS')) {
    icon = '<img src="../../images/ios_16_icon.png" style="width:0.8rem; height:0.8rem; vertical-align: top;" class="option-icon">';
    }
    return icon
}