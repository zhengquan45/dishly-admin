import { addProduct, product, updateProduct } from '@/services/ant-design-pro/api';
import { PlusCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { ProFormMoney } from '@ant-design/pro-form/lib';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Image, message } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

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
      subName: fields.subName,
      // @ts-ignore
      imageUrl: fields.imageUrl?.at(0).response?.url,
      category: fields.category,
      price: fields.price,
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
      price: fields.price,
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
      message.success(`图片上传成功！链接：${imageUrl}`);
      console.log('图片链接:', imageUrl);
    } else {
      message.error('图片上传失败！');
    }
  }
};

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
      title: (
        <FormattedMessage
          id="pages.product.searchTable.updateForm.imageUrlLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'imageUrl',
      render: (url) => {
        return url ? (
          // @ts-ignore
          <Image src={url} width={272} />
        ) : (
          <Image src="https://via.placeholder.com/300x200" width="20" />
        );
      },
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.product.searchTable.updateForm.categoryLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'category',
      valueType: 'select',
      valueEnum: {
        '': {
          text: '全部',
        },
        午餐: {
          text: '午餐',
        },
        晚餐: {
          text: '晚餐',
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.product.searchTable.updateForm.priceLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'price',
      valueType: 'text',
      renderText: (price) => {
        return (price ? price : 0) + ' ¥';
      },
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.product.searchTable.updateForm.createdAtLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'createdAt',
      valueType: 'text',
      renderText: (timestamp) => {
        return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.product.searchTable.updateForm.updatedAtLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'updatedAt',
      valueType: 'text',
      renderText: (timestamp) => {
        return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
      },
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.product.searchTable.updateForm.isAvailableLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      valueType: 'select',
      valueEnum: {
        '': {
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
        </a>,
      ],
    },
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
            <PlusCircleFilled />{' '}
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={product}
        columns={columns}
      />
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
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.product.searchTable.updateForm.subNameLabel',
            defaultMessage: 'productName',
          })}
          width="md"
          name="subName"
        />

        <ProFormSelect
          name="category"
          width="md"
          label={intl.formatMessage({
            id: 'pages.product.searchTable.updateForm.categoryLabel',
            defaultMessage: 'product category',
          })}
          valueEnum={{
            午餐: {
              text: '午餐',
            },
            晚餐: {
              text: '晚餐',
            },
          }}
        />
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
          name="price"
        />
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
