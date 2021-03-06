/*
changeCamera: get camera vlookat, hlookat, fov value instantly
logoTripod: listen to logo tripod always face to me
topLogoTripod: listen to top logo tripod always face to me
vr_menu_events: vr mode menu
*/
const eventsXml = `<events name="changeCamera" keep="true" onviewchange="change_camera(get('view.hlookat'), get('view.vlookat'));" />
<events name="logoTripod" keep="true" onviewchange="copy(hotspot[logoTripod].rotate, view.hlookat));" />
<events name="topLogoTripod" keep="true" onviewchange="def(rotate, string, calc(view.hlookat * -1));copy(hotspot[topLogoTripod].rotate, rotate);" />
<events name="vr_menu_events" keep="true" onviewchange="vr_menu_following();" />
<events onclick="click_krpano_screen();" />`

export default eventsXml
