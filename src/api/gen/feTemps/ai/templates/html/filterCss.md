以下内容是功能清单，请根据描述生成相关代码

## 代码目录

1. html入口： `src\modules\xxx\index.html`
2. css入口： `src\modules\xxx\index.css`
3. 新css入口： `src\modules\xxx\new.css`

## 详细描述

1. index.html 和 index.css是外部网站优秀组件，是编译后的代码
2. 请根据index.html和index.css，生成一个新css文件new.css，该文件仅包含index.html使用到的css。
3. 如果css文件过大导致失败 可以使用命令，把相关class选取出来:

```bash
# 示例
$classes = 'classname1', 'classname2', 'classname3'
$nestedPattern = '\.(' + ($classes -join '|') + ')(\s+\.[a-zA-Z0-9_-]+)?\s*\{[^}]*\}'

Get-Content -Path "your.css" -Raw |
Select-String -Pattern $nestedPattern -AllMatches |
ForEach-Object { $_.Matches } |
ForEach-Object { $_.Value } |
Out-File -FilePath "css_matched.txt"

```

4. 通过命令写完的文件请直接阅读文件，不能使用Get-Content等命令阅读，因为文件过大，可能会导致命令执行失败，或被终端截断
