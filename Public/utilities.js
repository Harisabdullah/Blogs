export const re_render_page = (response) => {
    const element = document.getElementById("frame");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    const page =  response.data;
    const doc = new DOMParser().parseFromString(page, "text/html");
    element.append(doc.body.firstChild);
    return 1
}

export const re_render_component = (frame_id, component) => {
    const element = document.getElementById(`${frame_id}`);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    const html_component = new DOMParser().parseFromString(component, "text/html");
    element.append(html_component.body.firstChild);
    return 1
}

