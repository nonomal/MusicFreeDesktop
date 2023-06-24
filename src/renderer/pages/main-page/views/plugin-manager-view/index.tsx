import { hideModal, showModal } from "@/renderer/components/Modal";
import PluginTable from "./components/plugin-table";
import "./index.scss";
import { getUserPerference } from "@/renderer/utils/user-perference";
import { ipcRendererInvoke } from "@/common/ipc-util/renderer";
import { toast } from "react-toastify";

export default function PluginManagerView() {
  const subscription = getUserPerference("subscription");

  return (
    <div className="plugin-manager-view-container">
      <div className="header">插件管理</div>
      <div className="operation-area">
        <div className="left-part">
          <div role="button" data-type="normalButton" onClick={() => {}}>
            从本地安装
          </div>
          <div
            role="button"
            data-type="normalButton"
            onClick={() => {
              showModal("SimpleInputWithState", {
                title: "从网络安装插件",
                placeholder: "请输入插件源地址(链接以json或js结尾)",
                okText: "安装",
                loadingText: "安装中",
                withLoading: true,
                async onOk(text) {
                  if(text.trim().endsWith('.json') || text.trim().endsWith('.js')) {
                    return ipcRendererInvoke("install-plugin-remote", text);

                  } else {
                    throw new Error("插件链接需要以json或者js结尾")
                  }
                },
                onPromiseResolved() {
                  toast.success('安装成功~');
                  hideModal();
                },
                onPromiseRejected(e) {
                  toast.warn(`安装失败: ${e.message ?? '无效插件'}`)

                },
                hints: [
                  "插件需要满足 MusicFree 特定的插件协议，具体可在官方网站中查看",
                ],
              });
            }}
          >
            从网络安装
          </div>
        </div>
        <div className="right-part">
          <div role="button" data-type="normalButton">
            订阅设置
          </div>
          <div role="button" data-type="normalButton" data-disabled={true}>
            更新订阅
          </div>
        </div>
      </div>
      <PluginTable></PluginTable>
    </div>
  );
}
