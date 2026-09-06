export type WelcomeLocale = 'en' | 'zh';

const en = {
  pageTitle: 'A little idea. A big adventure. | Musein',
  skipToContent: 'Skip to tutorial', homepage: 'Musein homepage',
  switchLanguage: 'Switch to Chinese', backToIntro: 'Start over', skipTour: 'Skip',
  back: 'Back', stepsLabel: 'Tutorial steps', navigationLabel: 'Tutorial navigation',
  intro: {
    welcome: 'Welcome to Musein', title: 'A little idea.', emphasis: 'A big adventure.',
    description: 'Turn an idea into images and video.',
    start: 'Show me how', note: 'Just a walkthrough. No credits used.',
  },
  steps: {
    idea: { label: 'Idea', title: 'Describe your idea.', description: 'An astronaut. A paper boat. A river in space. Start with one scene.', next: 'See the image' },
    image: { label: 'Image', title: 'Find the look.', description: 'This is the image we generated from that prompt. Next, use it as a video reference.', next: 'Make it move' },
    motion: { label: 'Video', title: 'Make it move.', description: 'Keep the image as a reference. Describe the movement and camera.', next: 'Try it yourself' },
  },
  prompt: {
    label: 'Prompt used for this image', explore: 'Tap a part to explore.',
    imageTranslationLabel: 'Full image prompt (Chinese translation)',
    originalMotion: 'Prompt used for this video',
    parts: [
      { label: 'Character', detail: 'A tiny astronaut in an orange paper boat.' },
      { label: 'World', detail: 'A glowing river in space, with a ringed planet behind.' },
      { label: 'Style', detail: 'Whimsical 3D animation, a wide shot and soft light.' },
    ],
    motionLabel: 'The movement',
    motionText: 'The boat glides forward, leaving ripples. The astronaut stays seated, while the camera follows alongside.',
  },
  image: {
    disclosure: 'This generated image was the actual reference for the video, not a frame extracted from it.',
  },
  compare: {
    label: 'Compare still and video', still: 'Still image', video: 'Moving video',
    stillHint: 'One frame establishes the look.', videoHint: 'Press play to see movement, depth and camera motion.',
  },
  media: {
    alt: 'A tiny astronaut in an orange paper boat floats on a glowing river beneath a ringed planet.',
    videoLabel: 'Galaxy paper boat: five-second Musein demo', duration: '5 sec', watch: 'Watch sample',
    loading: 'Loading sample…', stillDisclosure: 'Actual generated input image',
    videoDisclosure: 'Pre-recorded Musein demo', replay: 'Watch again', retry: 'Try again',
    slow: 'Taking a little longer to load. Keep exploring, or try the sample again.',
    error: 'The sample couldn’t load. You can still explore all three steps.',
    imageError: 'The sample image couldn’t load. You can still continue to the video step.', imageRetry: 'Retry image',
  },
  desktop: {
    title: 'Make your own.', emphasis: 'On a bigger screen.',
    description: 'Open Musein on your computer to create with the full canvas.',
    explain: 'Why a computer?',
    explanation: 'The canvas keeps your prompts, images and videos in one visual workspace. A bigger screen gives you room to connect and edit them.',
    linkLabel: 'Desktop workspace link', copy: 'Copy desktop link', copied: 'Link copied',
    copyError: 'Copy isn’t available here. Select and copy the link above.',
    copySuccess: 'Open this link on your computer and sign in to your account.',
    copyHint: 'Open this link on your computer. This demo doesn’t create a project.',
    open: 'On a computer? Open Musein',
  },
} as const;

// Both languages must have the same complete shape, including errors and ARIA copy.
type Localized<T> = { readonly [K in keyof T]: T[K] extends string ? string : Localized<T[K]> };
export type WelcomeCopy = Localized<typeof en>;

const zh: WelcomeCopy = {
  pageTitle: '小小灵感，大大冒险。| Musein',
  skipToContent: '跳到教程内容', homepage: 'Musein 首页',
  switchLanguage: 'Switch to English / 切换到英文', backToIntro: '重新开始', skipTour: '跳过',
  back: '上一步', stepsLabel: '教程步骤', navigationLabel: '教程导航',
  intro: {
    welcome: '欢迎来到 Musein', title: '小小灵感，', emphasis: '大大冒险。',
    description: '把脑海中的想法，变成图片和视频。',
    start: '看看怎么做', note: '演示体验，不消耗点数。',
  },
  steps: {
    idea: { label: '灵感', title: '说说你的想法。', description: '小宇航员坐着纸船，漂过银河。先从一个画面开始。', next: '看看图片' },
    image: { label: '图片', title: '先选定画面。', description: '这就是用刚才的提示词生成的图片。下一步，用它作为视频参考。', next: '让它动起来' },
    motion: { label: '视频', title: '让它动起来。', description: '保留这张参考图，再告诉 Musein：角色怎么动，镜头怎么拍。', next: '我也想试试' },
  },
  prompt: {
    label: '本次图片生成原文（英文）', explore: '点一点，看看怎么描述。',
    imageTranslationLabel: '完整图片提示词（中文翻译）',
    originalMotion: '本次视频生成原文（英文）',
    parts: [
      { label: '角色', detail: '一个小宇航员，坐在橙色纸船里。' },
      { label: '场景', detail: '太空中发光的河流，远处是一颗带环的行星。' },
      { label: '风格', detail: '奇幻的 3D 动画风格，远景构图，柔和光线。' },
    ],
    motionLabel: '让画面这样动',
    motionText: '纸船向前漂，水面泛起涟漪。宇航员保持坐姿，镜头在船旁跟随。',
  },
  image: {
    disclosure: '这张图是实际生成并用于视频参考的图片，不是从成片截取的画面。',
  },
  compare: {
    label: '对比图片与视频', still: '静态图片', video: '动态视频',
    stillHint: '先用一张图，确定画面风格。', videoHint: '点击播放，看看角色动作、空间变化和镜头运动。',
  },
  media: {
    alt: '小宇航员坐在橙色纸船里，漂在发光的河流上，远处是一颗带环行星。',
    videoLabel: '银河纸船：在 Musein 生成的五秒演示视频', duration: '5 秒', watch: '播放示例',
    loading: '正在加载示例…', stillDisclosure: '本次实际生成的输入图',
    videoDisclosure: 'Musein 生成的成片演示', replay: '再看一遍', retry: '重试',
    slow: '加载有点慢。你可以继续看教程，也可以再试一次。',
    error: '示例暂时加载不出来，但你仍然可以浏览全部三个步骤。',
    imageError: '示例图片暂时加载不出来，你仍然可以继续查看视频这一步。', imageRetry: '重新加载图片',
  },
  desktop: {
    title: '想自己试试？', emphasis: '去电脑上创作。',
    description: '在电脑上打开 Musein，体验完整的创作画布。',
    explain: '为什么需要电脑？',
    explanation: '画布把提示词、图片和视频放在同一张可视化工作台上。用更大的屏幕，连接和编辑它们会更方便。',
    linkLabel: '电脑端工作空间链接', copy: '复制电脑端链接', copied: '链接已复制',
    copyError: '当前浏览器无法自动复制，请选中上方链接手动复制。',
    copySuccess: '在电脑上打开这个链接，登录你的账号即可。',
    copyHint: '请在电脑上打开此链接。本演示不会创建项目。',
    open: '已经在用电脑？打开 Musein',
  },
};

export const welcomeCopy: Record<WelcomeLocale, WelcomeCopy> = { en, zh };
export function getWelcomeLocale(language: string): WelcomeLocale { return language === 'zh' ? 'zh' : 'en'; }
