## 重要说明

开发的第一步是找到`@/api/xxx/controller`定义的`axios实例调用`的请求方法，仔细阅读所有列出的请求方法的文件，并且向我请求阅读这些所有请求方法文件内容，并根据请求方法ts文件内实际使用的 所有输入输出interface进行编码，如果有一个没找到就不开发了，直接抛错。
比如下面的请求方法：

```ts
export function postBasicV1VoltageDownloadTplDemo(input?: PostBasicV1VoltageDownloadTplDemoInput, config?: AxiosRequestConfig) {
  return request.post<DeepRequired<PostBasicV1VoltageDownloadTplDemoResult>>(`/basic/v1/voltage/downloadTplDemo`, input, config);
}
```

你要找到`PostBasicV1VoltageDownloadTplDemoInput` 和 `PostBasicV1VoltageDownloadTplDemoResult` 并阅读内容;

## 其他说明

请严格按照下面的说明编码

1. 请求实例统一在 `接口导入地址` 导出了,例如： @/api/xxx/controller 只能使用`@/api/xxx/controller` 这样的导入方式。不能使用 类似这样的完整导入`@/api/xxx/controller/xxx/xxx`
2. 输入输出的interface，有的在接口文件导出了，有的在 @/api/xxx/interface 导出了 直接使用即可，使用方式类似`@/api/xxx/controller`
3. 类似 `<gm-button>` 的组件，完整的复刻了element-plus的组件，只是样式上做了调整，使用时请参考element-plus的文档
4. 当前的代码都处于vue3 + giime（类似element-plus的组件库） + tailwindcss 环境中
5. 当你发现你已经创建了composables/useApiOptions.ts，ts还提示文件不存在，请跳过这个错误，因为可能vscode没有反应过来
6. @/api 文件夹下的文件可以简单修改，不能新建和删除文件
7. 写所有功能前都要完整阅读请求文件，请求文件中包含了请求的输入输出，以及请求的注释，请仔细阅读，不要自己编参数
8. 请求的输入和输出都可以在请求文件中找到，请先阅读请求代码。请严格按照请求文件定义的interface来写代码，可以直接使用这些interface，请求文件在controller下面深层文件夹的某个文件内，你要一层一层的文件夹往下找，直到找到请求文件
9. 在请求地址说明中，如果我给你请求文件名，则你自己查找到文件，如果我给你请求路由地址，则文件地址就是通过 请求方法+路由地址反推出来的
   比如 post请求 `/open/v1/system/list` 的文件名是 `postOpenV1SystemList.ts`
10. 数据源：下拉框、单选框等的数据源，可以根据接口文档的注释来获取。获取后 应该在useXxxOptions中抽离复用。

## 增删改查 代码模板，供你学习代码规范和风格

### 代码模板使用说明：

1. 代码模板中包含增删改查功能的基本实现，请根据实际需求进行调整。
2. 代码模板中的请求地址为示例地址，请根据实际情况修改为真实请求地址。
3. 代码模板中的参数和返回数据结构为示例，请根据实际情况进行调整。
4. 调用请求 逻辑部分可以使用useLoading工具函数，给予用户更好的体验。如果已经内置了isLoading 就不用加了
5. 每个方法和变量定义时，请添加适量jsdoc注释。
6. 增删改查 文件按模板那样拆分，不能少文件

### 代码模板

index.vue

```vue
<template>
  <gm-table-ctx :tableId="tableId" class="p-5">
    <h1 class="mb-6 font-bold">你的标题</h1>
    <!-- 搜索 -->
    <Search v-model:queryParams="queryParams" :showSearch="showSearch" @getList="getList" />
    <!-- 工具栏 -->
    <TableToolbar
      v-model:showSearch="showSearch"
      v-model:queryParams="queryParams"
      :notSelected="notSelected"
      :total="total"
      :selectedIds="selectedIds"
      class="mb-3"
      @openAddForm="editDialogRef?.openAddForm"
      @batchDelete="handleDelete()"
      @getList="getList"
    />
    <!-- 表格 -->
    <Table
      v-model:sortValue="sortValue"
      v-loading="isLoading"
      :listData="listData"
      @selectionChange="handleSelectionChange"
      @handleDelete="handleDelete"
      @openUpdateForm="editDialogRef?.openUpdateForm"
      @getList="getList"
    />
    <!-- 分页 -->
    <gm-table-pagination v-model:page="queryParams.current" v-model:limit="queryParams.size" :total="total" @pagination="getList" />
    <!-- 编辑弹窗 -->
    <EditDialog ref="editDialogRef" @getList="getList" />
  </gm-table-ctx>
</template>

<script setup lang="ts">
import { useLoading } from 'giime';
import { useRoute } from 'vue-router';
import EditDialog from './components/EditDialog.vue';
import Search from './components/Search.vue';
import Table from './components/Table.vue';
import TableToolbar from './components/TableToolbar.vue';
import { useAppOptions } from './composables/useAppOptions';
import type { TableProSortValue } from 'giime';

// 接口
import type { SelectIsvAppReq, SelectIsvAppVo } from '@/api/open/interface';
import { postOpenV1IsvAppPage, postOpenV1IsvAppRemove } from '@/api/open/controller';
const route = useRoute();
const editDialogRef = ref<InstanceType<typeof EditDialog>>();

const { tableId } = useAppOptions();
// 打开搜索模块
const showSearch = ref(true);
const selectedIds = ref<number[]>([]);
// 多选
const isMultiple = ref(false);
// 未选中
const notSelected = ref(true);

const total = ref(0);
// 列表请求参数
const queryParams = ref<SelectIsvAppReq>({
  corpId: 0,
  appName: undefined,
  authMode: undefined,
  appIdStr: undefined,
  serviceId: undefined,
  appIp: undefined,
  createTime: [],
  status: undefined,
  updateTime: [],
  /** 当前页 */
  current: 1,
  /** 每页显示条数 */
  size: 10,
});

const sortValue = ref<TableProSortValue[]>([]);
const listData = ref<SelectIsvAppVo[]>([]);
const { isLoading, exec: getListExec } = useLoading(postOpenV1IsvAppPage);
/** 获取列表 */
const getList = async () => {
  const { data } = await getListExec({
    ...queryParams.value,
    sorts: sortValue.value,
  });
  if (data?.code !== 200) {
    return;
  }
  listData.value = data?.data.records || [];
  total.value = data?.data.total || 0;
};

/** 多选框选中数据 */
const handleSelectionChange: (value: any[]) => any = (selection: SelectIsvAppVo[]) => {
  selectedIds.value = selection.map(item => item.id);
  isMultiple.value = selection.length !== 1;
  notSelected.value = !selection.length;
};

/** 删除按钮操作 */
const handleDelete = async (row?: SelectIsvAppVo) => {
  const selectIds = row ? [row.id] : selectedIds.value;
  GmConfirmBox({ message: `请确定是否删除，删除后不可恢复！` }, async () => {
    const { data } = await postOpenV1IsvAppRemove({ ids: selectIds });
    if (data.code !== 200) {
      return;
    }
    GmMessage.success('删除成功');
    getList();
  });
};
</script>

components/Search.vue 

如果无需级联选择器的话，无需selectedSysName相关代码
```vue
<template>
  <section>
    <gm-search-form v-show="showSearch" v-model:query-params="queryParams" @handle-query="handleQuery" @reset-query="resetQuery">
      <gm-search-form-input prop="appName" label="应用名称" />
      <gm-search-form-select prop="status" label="应用状态" :options="statusOptions" />
      <gm-search-form-select prop="authMode" label="鉴权模式" :options="authModeOptions" />
      <gm-search-form-cascader
        v-model="selectedSysName"
        prop="undefined1"
        label="所属系统"
        :options="systemTreeStore.systemTree"
        :cascader-props="{ value: 'id', label: 'name', children: 'children' }"
        @change="handleSelectedSysNameChange"
      />
      <gm-search-form-date-picker prop="createTime" label="创建" type="daterange" />
    </gm-search-form>
  </section>
</template>
<script lang="ts" setup>
import { useAppOptions } from '../composables/useAppOptions';
import type { SelectIsvAppReq } from '@/api/open/interface';

defineProps<{
  showSearch: boolean;
}>();
const emit = defineEmits<{
  (e: 'getList'): Promise<any>;
}>();
const systemTreeStore = useSystemTreeStore();
const { authModeOptions, statusOptions } = useAppOptions();
// 列表请求参数
const queryParams = defineModel<SelectIsvAppReq>('queryParams', { required: true });
const selectedSysName = ref([]);
const handleSelectedSysNameChange = () => {
  if (!selectedSysName.value) {
    queryParams.value.subId = undefined;
  } else {
    queryParams.value.subId = selectedSysName.value.at(-1);
  }
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.current = 1;
  emit('getList');
};
/** 重置按钮操作 */
const resetQuery = () => {
  // queryRef.value?.resetFields();
  selectedSysName.value = [];
  queryParams.value.subId = undefined;
  handleQuery();
};
defineExpose({
  queryParams,
});
</script>
```

components/TableToolbar

```vue
<template>
  <div class="mb-3">
    <gm-table-toolbar
      v-model:showSearch="showSearch"
      v-model:queryParams="queryParams"
      :tableId="tableId"
      :total="total"
      :selected-count="selectedIds.length"
      @getList="emit('getList')"
    >
      <gm-col :span="1.5">
        <gm-button plain @click="emit('openAddForm')">新增</gm-button>
      </gm-col>
      <gm-col :span="1.5">
        <gm-button plain :disabled="notSelected" @click="handleBatchModifyStatus(0)">禁用</gm-button>
      </gm-col>
      <gm-col :span="1.5">
        <gm-button plain :disabled="notSelected" @click="emit('batchDelete')">删除</gm-button>
      </gm-col>
    </gm-table-toolbar>
  </div>
</template>
<script lang="ts" setup>
import { useAppOptions } from '../composables/useAppOptions';
import type { SelectIsvAppReq } from '@/api/open/interface';
import { postOpenV1IsvAppModifyStatus } from '@/api/open/controller';
const props = defineProps<{
  notSelected: boolean;
  total: number;
  selectedIds: number[];
}>();
const emit = defineEmits<{
  (e: 'openAddForm'): void;
  (e: 'batchDelete'): void;
  (e: 'getList'): Promise<any>;
}>();

const showSearch = defineModel<boolean>('showSearch', { required: true });
const queryParams = defineModel<SelectIsvAppReq>('queryParams', { required: true });

const { tableId } = useAppOptions();
/** 批量启用禁用操作 */
const handleBatchModifyStatus = async (status: number) => {
  // const selectIds = row ? [row.id] : selectedIds.value;
  GmConfirmBox({ message: `确定要禁用该应用吗？` }, async () => {
    const { data } = await postOpenV1IsvAppModifyStatus({ ids: props.selectedIds, status });
    if (data.code !== 200) {
      return;
    }
    GmMessage.success('禁用成功');
    emit('getList');
  });
};
</script>
```

components/Table.vue

```vue
<template>
  <div>
    <gm-table-pro
      v-model:sortValue="sortValue"
      :data="listData"
      :page="tableId"
      :selection="true"
      :height-offset="20"
      @selectionChange="emit('selectionChange', $event)"
      @sortChange="emit('getList')"
    >
      <gm-table-column-pro label="应用信息" align="left" prop="appName" show-overflow-tooltip min-width="330">
        <template #default="{ row }: { row: SelectIsvAppVo }">
          <div class="flex items-center gap-3">
            <gm-avatar
              shape="square"
              size="large"
              src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
              class="h-[60px] w-[60px] shrink-0"
            />
            <div>
              <div>
                {{ row.appName }}
                <gm-copy-icon
                  :str="`应用名: ${row.appName}
应用ID: ${row.appIdStr}
client_id: ${row.clientId}
client_secret: ${row.clientSecret}`"
                />
              </div>
              <div class="mt-1 text-[#999]">应用ID：{{ row.appIdStr }}</div>
            </div>
          </div>
        </template>
      </gm-table-column-pro>
      <gm-table-column-pro label="应用描述" align="left" prop="appDesc" width="250">
        <template #default="{ row }: { row: SelectIsvAppVo }">
          <div>
            <el-tooltip effect="dark" :content="row.appDesc" placement="top">
              <template #content>
                <div class="max-w-[300px] whitespace-break-spaces">{{ row.appDesc }}</div>
              </template>
              <div class="line-clamp-1">{{ row.appDesc }}</div>
            </el-tooltip>
          </div>
        </template>
      </gm-table-column-pro>
      <gm-table-column-pro label="应用IP" align="left" prop="appIp" show-overflow-tooltip width="140">
        <template #default="{ row }: { row: SelectIsvAppVo }">
          <div v-for="(item, index) in row.appIp?.split(',') ?? []" :key="index">
            {{ item }}
          </div>
        </template>
      </gm-table-column-pro>
      <gm-table-column-pro label="鉴权模式" align="left" prop="authMode" width="140">
        <template #default="scope">
          <template v-for="item in authModeOptions">
            <template v-if="scope.row.authMode === item.value">
              <gm-tag :key="item.label" :type="item.tageType">{{ item.label }}</gm-tag>
            </template>
          </template>
        </template>
      </gm-table-column-pro>
      <gm-table-column-pro label="应用状态" align="left" prop="status" width="120">
        <template #default="{ row }: { row: SelectIsvAppVo }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            class="ml-2"
            :loading="modifyStatusLoading"
            size="large"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :before-change="() => beforeChangeStatus(row)"
          />
        </template>
      </gm-table-column-pro>
      <gm-table-column-pro label="client_id" align="left" prop="clientId" width="180" />
      <gm-table-column-pro label="client_secret" align="left" prop="clientSecret" width="180" />
      <gm-table-column-pro label="创建时间" align="left" prop="createTime" width="180" min-width="180" isSort>
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </gm-table-column-pro>
      <gm-table-column-pro label="更新时间" align="left" prop="updateTime" width="180" min-width="180" isSort>
        <template #default="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </gm-table-column-pro>
      <gm-table-column-pro prop="" type="edit">
        <template #default="{ row }">
          <gm-operate-button label="编辑" prop="edit" type="primary" class="mb-1 mr-1" @click="emit('openUpdateForm', row)" />
          <gm-operate-button label="删除" prop="delete" type="primary" class="mb-1" @click="emit('handleDelete', row)" />
          <gm-operate-button label="开通服务" prop="subscribe" type="primary" :disabled="row.status === 0" @click="handleSubscribe(row)" />
        </template>
      </gm-table-column-pro>
    </gm-table-pro>
    <SubscribeServiceDialog ref="subscribeServiceDialogRef" :listData="listData" @getList="emit('getList')" />
  </div>
</template>
<script setup lang="ts">
import { useLoading } from 'giime';
import { useAppOptions } from '../composables/useAppOptions';
import SubscribeServiceDialog from './SubscribeServiceDialog.vue';
import type { TableProSortValue } from 'giime';
import type { SelectIsvAppVo } from '@/api/open/interface';
import { postOpenV1IsvAppModifyStatus } from '@/api/open/controller';

defineProps<{
  listData: SelectIsvAppVo[];
}>();
const emit = defineEmits<{
  (e: 'selectionChange', value: any[]): any;
  (e: 'openUpdateForm', row: SelectIsvAppVo): any;
  (e: 'handleDelete', row: SelectIsvAppVo): any;
  (e: 'getList'): Promise<any>;
}>();

const sortValue = defineModel<TableProSortValue[]>('sortValue', { required: true });

const subscribeServiceDialogRef = ref<InstanceType<typeof SubscribeServiceDialog>>();

const { tableId, authModeOptions, statusOptions } = useAppOptions();

const { isLoading: modifyStatusLoading, exec: modifyStatusExec } = useLoading(postOpenV1IsvAppModifyStatus);
const beforeChangeStatus = async (row: SelectIsvAppVo) => {
  const { data } = await modifyStatusExec({ ids: [row.id], status: row.status === 1 ? 0 : 1 });
  if (data.code !== 200) {
    return false;
  }

  return true;
};

const handleSubscribe = (row: SelectIsvAppVo) => {
  subscribeServiceDialogRef.value?.openDialogForm(row);
};
</script>
```

components/EditDialog.vue

```vue
<template>
  <!-- 添加/修改对话框 -->
  <gm-dialog v-model="editDialogVisible" :title="isAddDialog ? '创建应用' : '编辑应用'" width="500px" append-to-body @closed="cancel">
    <EditForm ref="editFormRef" v-model:editForm="editForm" @getList="emit('getList')" />
    <template #footer>
      <div class="dialog-footer">
        <gm-button type="primary" :loading="submitLoading" @click="submitForm">确 定</gm-button>
        <gm-button @click="cancel">取 消</gm-button>
      </div>
    </template>
  </gm-dialog>
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import { resetObject } from 'giime';
import EditForm from './EditForm.vue';
import type { AddIsvAppReq, SelectIsvAppVo } from '@/api/open/interface';
import { postOpenV1IsvAppModify, postOpenV1IsvAppSave } from '@/api/open/controller';
import { useCompanyStore } from '@/modules/company/stores/companyStore';
const companyStore = useCompanyStore();

const emit = defineEmits<{
  (e: 'getList'): Promise<any>;
}>();

/**
 * 编辑表单
 */
const editDialogVisible = ref(false);
const isAddDialog = ref(true);
const editFormRef = ref<InstanceType<typeof EditForm>>();
const fromId = ref(0);
const defaultEditForm: AddIsvAppReq = {
  corpId: '',
  appName: '',
  authMode: 1,
  appHome: undefined,
  appIp: '',
  appDesc: '',
};
const editForm = ref(cloneDeep(defaultEditForm));

/** 新增按钮操作 */
const openAddForm = () => {
  editDialogVisible.value = true;
  isAddDialog.value = true;
};
/** 取消按钮 */
function cancel() {
  editDialogVisible.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  fromId.value = 0;
  // 表单加载可能有延迟   会导致重置失败
  editFormRef.value?.resetFields?.();
  // 手动重置
  editForm.value = cloneDeep(defaultEditForm);
}

/** 修改按钮操作 */
const openUpdateForm = (row: SelectIsvAppVo) => {
  reset();
  isAddDialog.value = false;
  // 如果需要从接口获取详情
  // const { data } = await getItemById({ id: selectId });
  fromId.value = row.id;
  resetObject(editForm.value, row);
  editDialogVisible.value = true;
};

const submitLoading = ref(false);
/** 提交按钮 */
const submitForm = async () => {
  try {
    await editFormRef.value?.validate?.();
  } catch (e) {
    return console.error(e);
  }
  if (!companyStore.activeCompany?.corpId) {
    return;
  }
  submitLoading.value = true;
  try {
    let res: { data: { code: number } };
    if (!fromId.value) {
      // 新增
      res = await postOpenV1IsvAppSave({
        ...editForm.value,
        corpId: companyStore.activeCompany.corpId,
      });
    } else {
      // 修改
      res = await postOpenV1IsvAppModify({ ...editForm.value, id: fromId.value });
    }
    submitLoading.value = false;
    if (res.data.code !== 200) {
      return;
    }
    if (isAddDialog.value) {
      companyStore.getList();
    }
    GmMessage.success('操作成功');
    editDialogVisible.value = false;
    emit('getList');
  } catch (e) {
    submitLoading.value = false;
    console.error(e);
  }
};
defineExpose({
  openAddForm,
  openUpdateForm,
});
</script>
```

components/EditForm.vue

```vue
<template>
  <div>
    <gm-form ref="editFormRef" :model="editForm" :rules="rules" label-width="auto">
      <gm-form-item label="应用名称" prop="appName">
        <gm-input v-model="editForm.appName" placeholder="请输入应用名称" maxlength="50" show-word-limit />
      </gm-form-item>
      <gm-form-item label="应用描述" prop="appDesc">
        <gm-input v-model="editForm.appDesc" type="textarea" placeholder="请输入应用描述" :rows="4" maxlength="200" show-word-limit />
      </gm-form-item>
      <gm-form-item label="应用IP" prop="appIp">
        <gm-input v-model="editForm.appIp" placeholder="请输入应用IP" maxlength="100" show-word-limit />
      </gm-form-item>
      <gm-form-item label="应用首页地址" prop="appHome">
        <gm-input v-model="editForm.appHome" placeholder="请输入应用首页地址" maxlength="100" show-word-limit />
      </gm-form-item>
      <gm-form-item label="鉴权模式" prop="authMode">
        <template #label>
          <div class="flex items-center gap-1">
            <span>鉴权模式</span>
            <el-tooltip class="box-item mt-[2px]" effect="dark" content="" placement="top">
              <template #content>
                <div class="w-[250px]">
                  为了保障系统安全，目前所有应用和服务默认采用“严格模式”。即使您选择了“宽松模式”，系统也会按照严格标准执行。建议您暂时保持“严格模式”，后续我们将提供更灵活的权限设置。
                </div>
              </template>
              <el-icon size="18"><i-ep-QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <gm-radio-group v-model="editForm.authMode">
          <gm-radio v-for="it in authModeOptions" :key="it.label" :value="it.value">{{ it.label }}</gm-radio>
        </gm-radio-group>
      </gm-form-item>
    </gm-form>
  </div>
</template>
<script setup lang="ts">
import { useAppOptions } from '../composables/useAppOptions';
import type { FormInstance } from 'giime';
import type { AddIsvAppReq } from '@/api/open/interface';

const editForm = defineModel<AddIsvAppReq>('editForm', { required: true });
const editFormRef = ref<FormInstance>();

const { authModeOptions, statusOptions, rules } = useAppOptions();

const resetFields = () => {
  return editFormRef.value?.resetFields();
};
const validate = () => {
  return editFormRef.value?.validate();
};
defineExpose({
  resetFields,
  validate,
});
</script>
```

composables/useAppOptions.ts

注意：tableId你应该自己生成一个，不要使用我提供的这个。使用uuid v4

```ts
export const useAppOptions = () => {
  /**
   * 表格id 
   */
  const tableId = '8145c521-054d-4c5c-bbdb-296528ad860c';
  /**
   * tageType 用于在列表中显示不同的颜色的tag
   */
  const authModeOptions = [
    { label: '严格模式', value: 1, tageType: 'danger' as const },
    { label: '宽松模式', value: 2, tageType: 'success' as const },
  ];
  // 状态：0-禁用，1-正常
  const statusOptions = [
    { label: '禁用', value: 0 },
    { label: '正常', value: 1 },
  ];
  const rules = {
    appName: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }],
    authMode: [{ required: true, message: '鉴权模式不能为空', trigger: 'blur' }],
    clientId: [{ required: true, message: '应用的client_id不能为空', trigger: 'blur' }],
    appId: [{ required: true, message: '应用ID不能为空', trigger: 'blur' }],
    clientSecret: [{ required: true, message: '应用的client_secret不能为空', trigger: 'blur' }],
    createTime: [{ required: true, message: '录入时间不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '应用状态不能为空', trigger: 'blur' }],
    serviceCount: [{ required: true, message: '开通服务数量不能为空', trigger: 'blur' }],
    updateTime: [{ required: true, message: '更新时间不能为空', trigger: 'blur' }],
  };
  return {
    tableId,
    rules,
    authModeOptions,
    statusOptions,
  };
};
```

## 项目目录结构规范

```text
├── src
|  ├── api
|  |  └── userCenter            # 某个模块的api接口目录
|  |     ├── controller             # 具体接口输出目录
|  |     ├── interface              # interface 总目录
|  |     ├── request.ts             # axios实例
|  |     └── swagger.config.json    # 自动生成接口配置
|  ├── App.vue
|  ├── assets
|  |  ├── iconfont              # iconfont图标目录
|  |  |  └── iconfont.config.json
|  |  ├── icons                 # 定义图标目录
|  |  |  └── svg
|  |  └── logo.svg
|  ├── components               # 公共组件目录
|  |  ├── SvgIcon.vue
|  |  └── types.ts
|  ├── composables              # 公共组合式函数目录
|  |  └── useImageUpload.ts
|  ├── env.d.ts
|  ├── main.ts
|  ├── modules
|  |  └── company               # 某个模块目录
|  |     ├── app                    # 某个模块的子模块目录
|  |     ├── components             # 某个模块的组件目录
|  |     ├── composables            # 某个模块的组合式函数目录
|  |     ├── index.vue              # 模块入口文件
|  |     └── stores                 # 某个模块的状态管理目录
|  ├── router                   # 路由目录
|  |  ├── index.ts
|  |  └── modules                  # 模块路由目录
|  |     ├── company.ts              # 某个模块的路由文件
|  |     └── system.ts
|  ├── stores                    # 公共状态管理目录
|  |  └── counter.ts
|  ├── style.css
|  ├── styles
|  |  └── element-ui.scss
|  ├── utils                     # 工具函数目录
|  |  ├── copy.ts
|  |  ├── request.ts
|  |  ├── scroll-to.ts
|  |  └── validateForm.ts
|  ├─constants                  # 常量目录，存放一些公共的常量
|  │      README.md
|  ├─directives                 # 自定义指令目录，存放Vue自定义指令文件
|  │      README.md
|  └── views                     # 视图目录
|     ├── company                   # 某个模块的视图目录
|     |  └── index.vue               # 模块视图入口文件（通常很简单，他导入了modules的组件）
|     ├── HomeView.vue
|     └── system
|        └── index.vue
```
