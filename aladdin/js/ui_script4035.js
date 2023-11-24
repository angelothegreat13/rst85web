$(function() {
	rebuildTinymce({
		// toolbar: false,
		dark_mode: true
	});
});

function rebuildTinymce(extraOpt = {}) {
	let options = {
		mode: "specific_textareas",
		editor_selector: "reqcontent",
		language: "ko_KR",
		plugins: [
			"advlist", "autolink", "lists", "link", "image", "charmap", "print", "preview", "anchor", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "paste", "code", "help", "wordcount", "save",
		],
		toolbar:
			"fontselect | fontsizeselect | forecolor | bold italic underline | alignjustify alignleft aligncenter alignright |  numlist | table tabledelete | link image",
		toolbar_mode: "wrap",

		menubar: false,
		// statusbar: false,
		branding: false,
		elementpath: false,
		relative_urls: false,
		remove_script_host: false,
		convert_urls: true,
		image_advtab: false,
		paste_data_images: true,
		mobile: {
			plugins: [
				"advlist", "autolink", "lists", "link", "image", "charmap", "print", "preview", "anchor", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "paste", "code", "help", "wordcount", "save", "autoresize",
			],
			toolbar:
				"fontselect | fontsizeselect | forecolor | bold italic underline | alignjustify alignleft aligncenter alignright |  numlist | table tabledelete | link image",
			toolbar_mode: "wrap",

			menubar: false,
			// statusbar: false,
			branding: false,
			elementpath: false,
			relative_urls: false,
			remove_script_host: false,
			convert_urls: true,

			image_advtab: false,
			placeholder: "내용을 입력하세요.",
		},
		content_style: `
					.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
						color: rgb(255 255 255 / 30%);
					}`,
	};
	for (let key in extraOpt) {
		let val = extraOpt[key];
		if (key == "dark_mode") {
			options.skin = "sublime-dark";
			options.content_css = "sub-dark";
		} else if (key == "image_upload") {
			options.images_upload_handler = function(blobInfo, success, failure) {
				let xhr, formData;
	
				xhr = new XMLHttpRequest();
				xhr.withCredentials = true;
				xhr.open('POST', "/common/upload/image");
	
				xhr.onload = function() {
					if (xhr.status != 200) {
						failure('HTTP Error: ' + xhr.status);
						return;
					}
					let jData = JSON.parse(xhr.responseText);
					if (!jData) {
						failure("파일업로드에서 오류가 발생하였습니다.");
						return;
					}
					if (!jData.success) {
						failure(jData.message);
						return;
					}
					
					success(/* settings.url_image_base + */jData.data);
					
				};
				console.log(xhr);
	
				formData = new FormData();
				formData.append('file', blobInfo.blob(), blobInfo.filename());
				// form_data.append("name", this._elemAtachName.val());
	
				xhr.send(formData);
			};
		} else if (key == "init_callback") {
			options.init_instance_callback = val;
		} else if (key == "toolbar") {
			options.toolbar = val;
			options.mobile.toolbar = val;
		} else {
			options[key] = val;
		}
	}

	// tinymce
	if ($("textarea.reqcontent").length > 0) {
		tinymce.remove();
		tinymce.init(options);
	}
}
