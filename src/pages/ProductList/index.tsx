import { addProduct, product, updateProduct } from '@/services/ant-design-pro/api';
import { PlusCircleFilled } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps, ProFormSelect } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Image, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import dayjs from 'dayjs';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { ProFormMoney } from '@ant-design/pro-form/lib';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.ProductListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addProduct({
      name: fields.name,
      // @ts-ignore
      imageUrl: fields.imageUrl?.at(0).response?.url,
      category: fields.category,
      price: fields.price
    });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateProduct({
      id: fields.id,
      name: fields.name,
      // @ts-ignore
      imageUrl: fields.imageUrl?.at(0).response?.url,
      category: fields.category,
      price: fields.price
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const handleUploadChange = (info: { file: any }) => {
  const { file } = info;

  if (file.status === 'uploading') {
    console.log('Uploading...');
    return;
  }

  if (file.status === 'done') {
    // 假设图床返回的链接在 response.url 中
    const imageUrl = file.response?.url;
    if (imageUrl) {
      message.success(`图片上传成功！链接：${imageUrl}`)
      console.log('图片链接:', imageUrl);
    } else {
      message.error('图片上传失败！')
    }
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
// const handleRemove = async (selectedRows: API.ProductListItem[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     await removeProduct({
//       key: selectedRows.map((row) => row.key),
//     });
//     hide();
//     message.success('Deleted successfully and will refresh soon');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Delete failed, please try again');
//     return false;
//   }
// };

const ProductList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ProductListItem>();
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.ProductListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.product.searchTable.updateForm.nameLabel"
          defaultMessage="Rule name"
        />
      ),
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.product.searchTable.updateForm.imageUrlLabel" defaultMessage="Description" />,
      dataIndex: 'imageUrl',
      render: (url) => {
        // @ts-ignore
        return url ? <Image src={url} width={272} /> : <Image src='https://via.placeholder.com/300x200' width="20" />;
      },
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.product.searchTable.updateForm.categoryLabel" defaultMessage="Description" />,
      dataIndex: 'category',
      valueType: 'select',
      valueEnum: {
        '':{
          text: '全部',
        },
        '午餐': {
          text: '午餐',
        },
        '晚餐': {
          text: '晚餐',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.product.searchTable.updateForm.priceLabel" defaultMessage="Description" />,
      dataIndex: 'price',
      valueType: 'text',
      renderText: (price) => {
        return (price ? price : 0 ) + ' ¥';
      },
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.product.searchTable.updateForm.createdAtLabel" defaultMessage="Description" />,
      dataIndex: 'createdAt',
      valueType: 'text',
      renderText: (timestamp) => {
        return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.product.searchTable.updateForm.updatedAtLabel" defaultMessage="Description" />,
      dataIndex: 'updatedAt',
      valueType: 'text',
      renderText: (timestamp) => {
        return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.product.searchTable.updateForm.isAvailableLabel" defaultMessage="Description" />,
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      valueType: 'select',
      valueEnum: {
        '':{
          text: '全部',
          status: 'Default',
        },
        true: {
          text: '启用',
          status: 'Success',
        },
        false: {
          text: '禁用',
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.update" defaultMessage="Update" />
        </a>
      ],
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.ProductListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.product.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusCircleFilled /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={product}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      {/*{selectedRowsState?.length > 0 && (*/}
      {/*  <FooterToolbar*/}
      {/*    extra={*/}
      {/*      <div>*/}
      {/*        <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}*/}
      {/*        <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}*/}
      {/*        <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />*/}
      {/*        &nbsp;&nbsp;*/}
      {/*        <span>*/}
      {/*          <FormattedMessage*/}
      {/*            id="pages.searchTable.totalServiceCalls"*/}
      {/*            defaultMessage="Total number of service calls"*/}
      {/*          />{' '}*/}
      {/*          {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}*/}
      {/*          <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />*/}
      {/*        </span>*/}
      {/*      </div>*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <Button*/}
      {/*      onClick={async () => {*/}
      {/*        await handleRemove(selectedRowsState);*/}
      {/*        setSelectedRows([]);*/}
      {/*        actionRef.current?.reloadAndRest?.();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <FormattedMessage*/}
      {/*        id="pages.searchTable.batchDeletion"*/}
      {/*        defaultMessage="Batch deletion"*/}
      {/*      />*/}
      {/*    </Button>*/}
      {/*    <Button type="primary">*/}
      {/*      <FormattedMessage*/}
      {/*        id="pages.searchTable.batchApproval"*/}
      {/*        defaultMessage="Batch approval"*/}
      {/*      />*/}
      {/*    </Button>*/}
      {/*  </FooterToolbar>*/}
      {/*)}*/}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.product.searchTable.createForm.newProduct',
          defaultMessage: 'New product',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.ProductListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              await actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.product.searchTable.updateForm.nameLabel',
            defaultMessage: 'productName',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.productName"
                  defaultMessage="Product name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormSelect
        name="category"
        width="md"
        label={intl.formatMessage({
          id: 'pages.product.searchTable.updateForm.categoryLabel',
          defaultMessage: 'product category',
        })}
        valueEnum={{
          '午餐': {
            text: '午餐',
          },
          '晚餐': {
            text: '晚餐',
          },
        }}/>
        <ProFormUploadButton
          label={intl.formatMessage({
            id: 'pages.product.searchTable.updateForm.imageUrlLabel',
            defaultMessage: 'product image url',
          })}
          max={1} // 限制只能上传一个文件
          action="/api/image" // SM.MS 图床上传地址
          name="imageUrl"
          onChange={handleUploadChange}
          listType="picture"
          accept="image/*" // 限制只能上传图片
        />
        <ProFormMoney
          label={intl.formatMessage({
            id: 'pages.product.searchTable.updateForm.priceLabel',
            defaultMessage: 'product price',
          })}
          width="md"
          name="price" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              await actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ProductList;
