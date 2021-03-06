
let debug = false;
let android = process.argv.indexOf("android") >= 0;
let ios = process.argv.indexOf("ios") >= 0;
let win_hlsl = process.platform === "win32" && process.argv.indexOf("opengl") < 0;
let d3d12 = process.argv.indexOf("direct3d12") >= 0;
let vulkan = process.argv.indexOf("vulkan") >= 0;
let raytrace = d3d12 || vulkan;
let metal = process.argv.indexOf("metal") >= 0;
let vr = process.argv.indexOf("--vr") >= 0;
let snapshot = process.argv.indexOf("--snapshot") >= 0;

let project = new Project("ArmorPaint");
project.addSources("Sources");
project.addLibrary("iron");
project.addLibrary("zui");
project.addLibrary("syslib");
project.addLibrary("formatlib");
project.addLibrary("geomlib");
project.addLibrary("shaderlib");
project.addShaders("Shaders/common/*.glsl", { noembed: false});
if (!snapshot) {
	project.addAssets("Assets/common/*", { notinlist: true, destination: "data/{name}" });
}
project.addAssets("Assets/export_presets/*", { notinlist: true, destination: "data/export_presets/{name}" });
project.addAssets("Assets/keymap_presets/*", { notinlist: true, destination: "data/keymap_presets/{name}" });
project.addAssets("Assets/locale/*", { notinlist: true, destination: "data/locale/{name}" });
project.addAssets("Assets/licenses/**", { notinlist: true, destination: "data/licenses/{name}" });
project.addAssets("Assets/plugins/*", { notinlist: true, destination: "data/plugins/{name}" });
project.addAssets("Assets/themes/*.json", { notinlist: true, destination: "data/themes/{name}" });
project.addAssets("Assets/meshes/*", { notinlist: true, destination: "data/meshes/{name}" });
if (metal) {
	project.addShaders("Shaders/common/metal/*.glsl", { noembed: false});
	project.addAssets("Assets/common/metal/*", { notinlist: true, destination: "data/{name}" });
}
project.addDefine("js-es=6");
project.addParameter("--macro include('arm.node.brush')");
project.addDefine("kha_no_ogg");
project.addDefine("zui_translate");
project.addDefine("arm_ltc");
project.addDefine("arm_appwh");
project.addDefine("arm_skip_envmap");
project.addDefine("arm_resizable");
project.addDefine("arm_taa");
project.addDefine("arm_veloc");
project.addDefine("arm_particles");
// project.addDefine("arm_physics");
// project.addDefine("arm_skin");

if (!android) {
	project.addDefine("arm_data_dir");
}

if (android) {
	project.addDefine("krom_android");
	project.addDefine("kha_android");
	project.addDefine("kha_android_rmb");
}
else if (ios) {
	project.addDefine("krom_ios");
	project.addDefine("kha_ios");
}
else if (process.platform === "win32") {
	project.addDefine("krom_windows");
	project.addDefine("kha_windows");
}
else if (process.platform === "linux") {
	project.addDefine("krom_linux");
	project.addDefine("kha_linux");
}
else if (process.platform === "darwin") {
	project.addDefine("krom_darwin");
	project.addDefine("kha_darwin");
}

if (debug) {
	project.addDefine("arm_debug");
	project.addParameter("--times");
	// project.addParameter("--no-inline");
}
else {
	project.addParameter("-dce full");
	project.addDefine("analyzer-optimize");
}

if (vr) {
	project.addDefine("arm_vr");
	project.addAssets("Assets/readme/readme_vr.txt", { notinlist: true, destination: "{name}" });
}

if (snapshot) {
	project.addDefine("arm_snapshot");
	project.addDefine("arm_image_embed");
	project.addParameter("--no-traces");
}

project.addAssets("Assets/readme/readme.txt", { notinlist: true, destination: "{name}" });

if (raytrace) {
	project.addLibrary("renderlib");
	project.addAssets("Libraries/renderlib/Assets/*", { notinlist: true, destination: "data/{name}" });
	if (d3d12) {
		project.addAssets("Libraries/renderlib/Shaders/*.cso", { notinlist: true, destination: "data/{name}" });
		project.addAssets("Assets/readme/readme_dxr.txt", { notinlist: true, destination: "{name}" });
	}
	else if (vulkan) {
		project.addAssets("Libraries/renderlib/Shaders/*.spirv", { notinlist: true, destination: "data/{name}" });
		project.addAssets("Assets/readme/readme_vkrt.txt", { notinlist: true, destination: "{name}" });
	}
}

if (android) {
	project.addAssets("Assets/readme/readme_android.txt", { notinlist: true, destination: "{name}" });
}
else if (ios) {
	project.addAssets("Assets/readme/readme_ios.txt", { notinlist: true, destination: "{name}" });
}

if (process.platform !== "darwin" && !raytrace && !android && !ios) {
	project.addDefine("rp_voxelao");
	project.addDefine("arm_voxelgi_revox");

	if (process.platform === "win32" && win_hlsl) {
		project.addShaders("Shaders/voxel_hlsl/*.glsl", { noprocessing: true, noembed: false });
	}
	else {
		project.addShaders("Shaders/voxel_glsl/*.glsl", { noembed: false });
	}
}

resolve(project);
