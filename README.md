# 说明文档

## 绑定上级机制
1.在第一次触发route.beforeEach时注册上级uid
2.将上级uid存储后重置url的uid为自己
3.在软件初始化完毕后 layout.created 绑定上级，或在登录后绑定