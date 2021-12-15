# 樂易捐 - 文字編輯器系統欄位外掛

## 安裝

```bash
npm i @wayneyen/ckeditor5-sysvar
```

## 使用

```vue
<template>
	<ckeditor :editor="editor" :config="editorConfig"></ckeditor>
</template>

<script>
import { Sysvar } from '@wayneyen/ckeditor5-sysvar';
...
export default {
  ...
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        sysvar: {
          options: [
            { code: 'mail.payer.lastName', label: '姓氏' },
            { code: 'mail.payer.firstName', label: '名字' },
            { code: 'mail.payer.fullName', label: '顯示名稱' },
            { code: 'mail.company.name', label: '公司名稱' }
          ]
        },
        plugins: [ Sysvar ],
        toolbar: [ 'sysvar' ]
      }
    }
  }
}
...
</script>
```

## 效果

![](https://demo.4family.co/sysvar.png)
