import { defineComponent, reactive, computed, unref, ref, watchEffect, toRaw, watch, onMounted, } from 'vue';
import { Tree, Empty } from 'ant-design-vue';
import { TreeIcon } from './TreeIcon';
import TreeHeader from './TreeHeader.vue';
import { ScrollContainer } from '/@/components/Container';
import { omit, get, difference } from 'lodash-es';
import { isArray, isBoolean, isFunction } from '/@/utils/is';
import { extendSlots, getSlot } from '/@/utils/helper/tsxHelper';
import { filter } from '/@/utils/helper/treeHelper';
import { useTree } from './useTree';
import { useContextMenu } from '/@/hooks/web/useContextMenu';
import { useDesign } from '/@/hooks/web/useDesign';
import { basicProps } from './props';
export default defineComponent({
    name: 'BasicTree',
    inheritAttrs: false,
    props: basicProps,
    emits: ['update:expandedKeys', 'update:selectedKeys', 'update:value', 'change', 'check'],
    setup(props, { attrs, slots, emit, expose }) {
        const state = reactive({
            checkStrictly: props.checkStrictly,
            expandedKeys: props.expandedKeys || [],
            selectedKeys: props.selectedKeys || [],
            checkedKeys: props.checkedKeys || [],
        });
        const searchState = reactive({
            startSearch: false,
            searchData: [],
        });
        const treeDataRef = ref([]);
        const [createContextMenu] = useContextMenu();
        const { prefixCls } = useDesign('basic-tree');
        const getReplaceFields = computed(() => {
            const { replaceFields } = props;
            return {
                children: 'children',
                title: 'title',
                key: 'key',
                ...replaceFields,
            };
        });
        const getBindValues = computed(() => {
            let propsData = {
                blockNode: true,
                ...attrs,
                ...props,
                expandedKeys: state.expandedKeys,
                selectedKeys: state.selectedKeys,
                checkedKeys: state.checkedKeys,
                checkStrictly: state.checkStrictly,
                replaceFields: unref(getReplaceFields),
                'onUpdate:expandedKeys': (v) => {
                    state.expandedKeys = v;
                    emit('update:expandedKeys', v);
                },
                'onUpdate:selectedKeys': (v) => {
                    state.selectedKeys = v;
                    emit('update:selectedKeys', v);
                },
                onCheck: (v, e) => {
                    let currentValue = toRaw(state.checkedKeys);
                    if (isArray(currentValue) && searchState.startSearch) {
                        const { key } = unref(getReplaceFields);
                        currentValue = difference(currentValue, getChildrenKeys(e.node.$attrs.node[key]));
                        if (e.checked) {
                            currentValue.push(e.node.$attrs.node[key]);
                        }
                        state.checkedKeys = currentValue;
                    }
                    else {
                        state.checkedKeys = v;
                    }
                    const rawVal = toRaw(state.checkedKeys);
                    emit('update:value', rawVal);
                    emit('check', rawVal, e);
                },
                onRightClick: handleRightClick,
            };
            return omit(propsData, 'treeData', 'class');
        });
        const getTreeData = computed(() => searchState.startSearch ? searchState.searchData : unref(treeDataRef));
        const getNotFound = computed(() => {
            return !getTreeData.value || getTreeData.value.length === 0;
        });
        const { deleteNodeByKey, insertNodeByKey, insertNodesByKey, filterByLevel, updateNodeByKey, getAllKeys, getChildrenKeys, } = useTree(treeDataRef, getReplaceFields);
        function getIcon(params, icon) {
            if (!icon) {
                if (props.renderIcon && isFunction(props.renderIcon)) {
                    return props.renderIcon(params);
                }
            }
            return icon;
        }
        async function handleRightClick({ event, node }) {
            const { rightMenuList: menuList = [], beforeRightClick } = props;
            let contextMenuOptions = { event, items: [] };
            if (beforeRightClick && isFunction(beforeRightClick)) {
                let result = await beforeRightClick(node, event);
                if (Array.isArray(result)) {
                    contextMenuOptions.items = result;
                }
                else {
                    Object.assign(contextMenuOptions, result);
                }
            }
            else {
                contextMenuOptions.items = menuList;
            }
            if (!contextMenuOptions.items?.length)
                return;
            createContextMenu(contextMenuOptions);
        }
        function setExpandedKeys(keys) {
            state.expandedKeys = keys;
        }
        function getExpandedKeys() {
            return state.expandedKeys;
        }
        function setSelectedKeys(keys) {
            state.selectedKeys = keys;
        }
        function getSelectedKeys() {
            return state.selectedKeys;
        }
        function setCheckedKeys(keys) {
            state.checkedKeys = keys;
        }
        function getCheckedKeys() {
            return state.checkedKeys;
        }
        function checkAll(checkAll) {
            state.checkedKeys = checkAll ? getAllKeys() : [];
        }
        function expandAll(expandAll) {
            state.expandedKeys = expandAll ? getAllKeys() : [];
        }
        function onStrictlyChange(strictly) {
            state.checkStrictly = strictly;
        }
        function handleSearch(searchValue) {
            if (!searchValue) {
                searchState.startSearch = false;
                return;
            }
            searchState.startSearch = true;
            const { title: titleField } = unref(getReplaceFields);
            searchState.searchData = filter(unref(treeDataRef), (node) => {
                return node[titleField]?.includes(searchValue) ?? false;
            }, unref(getReplaceFields));
        }
        function handleClickNode(key, children) {
            if (!props.clickRowToExpand || !children || children.length === 0)
                return;
            if (!state.expandedKeys.includes(key)) {
                setExpandedKeys([...state.expandedKeys, key]);
            }
            else {
                const keys = [...state.expandedKeys];
                const index = keys.findIndex((item) => item === key);
                if (index !== -1) {
                    keys.splice(index, 1);
                }
                setExpandedKeys(keys);
            }
        }
        watchEffect(() => {
            treeDataRef.value = props.treeData;
        });
        onMounted(() => {
            const level = parseInt(props.defaultExpandLevel);
            if (level > 0) {
                state.expandedKeys = filterByLevel(level);
            }
            else if (props.defaultExpandAll) {
                expandAll(true);
            }
        });
        watchEffect(() => {
            state.expandedKeys = props.expandedKeys;
        });
        watchEffect(() => {
            state.selectedKeys = props.selectedKeys;
        });
        watchEffect(() => {
            state.checkedKeys = props.checkedKeys;
        });
        watch(() => props.value, () => {
            state.checkedKeys = toRaw(props.value || []);
        });
        watch(() => state.checkedKeys, () => {
            const v = toRaw(state.checkedKeys);
            emit('update:value', v);
            emit('change', v);
        });
        // watchEffect(() => {
        //   console.log('======================');
        //   console.log(props.value);
        //   console.log('======================');
        //   if (props.value) {
        //     state.checkedKeys = props.value;
        //   }
        // });
        watchEffect(() => {
            state.checkStrictly = props.checkStrictly;
        });
        const instance = {
            setExpandedKeys,
            getExpandedKeys,
            setSelectedKeys,
            getSelectedKeys,
            setCheckedKeys,
            getCheckedKeys,
            insertNodeByKey,
            insertNodesByKey,
            deleteNodeByKey,
            updateNodeByKey,
            checkAll,
            expandAll,
            filterByLevel: (level) => {
                state.expandedKeys = filterByLevel(level);
            },
        };
        expose(instance);
        function renderAction(node) {
            const { actionList } = props;
            if (!actionList || actionList.length === 0)
                return;
            return actionList.map((item, index) => {
                let nodeShow = true;
                if (isFunction(item.show)) {
                    nodeShow = item.show?.(node);
                }
                else if (isBoolean(item.show)) {
                    nodeShow = item.show;
                }
                if (!nodeShow)
                    return null;
                return (<span key={index} class={`${prefixCls}__action`}>
              {item.render(node)}
            </span>);
            });
        }
        function renderTreeNode({ data, level }) {
            if (!data) {
                return null;
            }
            return data.map((item) => {
                const { title: titleField, key: keyField, children: childrenField, } = unref(getReplaceFields);
                const propsData = omit(item, 'title');
                const icon = getIcon({ ...item, level }, item.icon);
                const children = get(item, childrenField) || [];
                return (<Tree.TreeNode {...propsData} node={toRaw(item)} key={get(item, keyField)}>
              {{
                        title: () => (<span class={`${prefixCls}-title pl-2`} onClick={handleClickNode.bind(null, item[keyField], item[childrenField])}>
                    {slots?.title ? (getSlot(slots, 'title', item)) : (<>
                        {icon && <TreeIcon icon={icon}/>}
                        <span class={unref(getBindValues)?.blockNode ? `${prefixCls}__content` : ''}>
                          {get(item, titleField)}
                        </span>
                        <span class={`${prefixCls}__actions`}>
                          {renderAction({ ...item, level })}
                        </span>
                      </>)}
                  </span>),
                        default: () => renderTreeNode({ data: children, level: level + 1 }),
                    }}
            </Tree.TreeNode>);
            });
        }
        return () => {
            const { title, helpMessage, toolbar, search, checkable } = props;
            const showTitle = title || toolbar || search || slots.headerTitle;
            const scrollStyle = { height: 'calc(100% - 38px)' };
            return (<div class={[prefixCls, 'h-full', attrs.class]}>
            {showTitle && (<TreeHeader checkable={checkable} checkAll={checkAll} expandAll={expandAll} title={title} search={search} toolbar={toolbar} helpMessage={helpMessage} onStrictlyChange={onStrictlyChange} onSearch={handleSearch}>
                {extendSlots(slots)}
              </TreeHeader>)}
            <ScrollContainer style={scrollStyle} v-show={!unref(getNotFound)}>
              <Tree {...unref(getBindValues)} showIcon={false}>
                {{
                    // switcherIcon: () => <DownOutlined />,
                    default: () => renderTreeNode({ data: unref(getTreeData), level: 1 }),
                    ...extendSlots(slots),
                }}
              </Tree>
            </ScrollContainer>

            <Empty v-show={unref(getNotFound)} image={Empty.PRESENTED_IMAGE_SIMPLE} class="!mt-4"/>
          </div>);
        };
    },
});
//# sourceMappingURL=Tree.vue.jsx.map
