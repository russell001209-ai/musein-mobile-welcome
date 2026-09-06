// Actual tasks created in the dedicated Musein demo canvas, 2026-09-06 (Asia/Shanghai).
// Original prompts are immutable evidence, not localized teaching copy.
// Re-verify the complete input/output chain before replacing this record.
const image = {
  status: 'completed',
  nodeId: '5dbab7c0-f0ce-4887-abc1-72145de4281e',
  taskId: 'ec430800-318f-44a8-8dbf-1267b3953bf9',
  model: 'Seedream 5.0 pro',
  resolution: '1K',
  outputUrl: 'https://files.musein.ai/canvas/media/202609051606_ec430800-318f-44a8-8dbf-1267b3953bf9.jpg',
  prompt: 'A tiny astronaut in a white spacesuit sits inside a folded orange paper boat, floating on a glowing turquoise river through outer space. A huge ringed planet rises in the background, surrounded by stars. Wide shot, whimsical cinematic 3D animation, soft light, no text or logos.',
  promptSha256: 'aad31223ab734f69e35a5117787f2f9e296672e3486475a7bc3c43d3c8945c15',
  // Reading aid only: the actual generation used the English prompt above.
  promptTranslationZh: '一个身形小巧、穿着白色宇航服的宇航员坐在一艘折叠的橙色纸船里，漂浮在一条穿行于太空、泛着青绿色光芒的河流上。背景中，一颗巨大的带环行星升起，周围繁星点点。远景镜头，充满奇幻想象的电影质感 3D 动画风格，柔和光线，不出现文字或标志。',
} as const;

const video = {
  status: 'completed',
  nodeId: '2bcd97fb-63e5-4aa9-bbe5-4bc14663fb75',
  taskId: '4fd3fb7c-8ec7-4995-8df6-24bcef6fb657',
  model: 'Seedance 2.5',
  resolution: '720p',
  durationSeconds: 5,
  generateAudio: false,
  inputMode: 'image_reference',
  inputImageUrl: image.outputUrl,
  outputUrl: 'https://files.musein.ai/canvas/media/202609051618_4fd3fb7c-8ec7-4995-8df6-24bcef6fb657.mp4',
  prompt: 'The orange paper boat glides slowly forward along the glowing river, leaving gentle ripples. The tiny astronaut stays seated. The camera tracks smoothly alongside the boat as the ringed planet remains in the background. One continuous shot, no cuts.',
  promptSha256: '6d535f9b8b9520c6b432c5cfe82e9ec8c75af571d816eb598b77ca95cca3874f',
} as const;

export const welcomeDemo = {
  provenance: 'generated-in-musein',
  image,
  video,
  imageUrl: image.outputUrl,
  videoUrl: video.outputUrl,
  desktopUrl: 'https://musein.ai/workspace',
  // Internal team verification link; do not expose the editing workspace as a public template.
  canvasUrl: 'https://musein.ai/workspace/536c0dcf-50e8-463a-921e-087032d7e702',
} as const;

export const welcomeSteps = [
  { id: 'idea' }, { id: 'image' }, { id: 'motion' },
] as const;

export type WelcomeStepId = typeof welcomeSteps[number]['id'];
