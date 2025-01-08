import { addBanner, banner, updateBanner } from '@/services/ant-design-pro/api';
import { PlusCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { ProFormDateTimeRangePicker, ProFormUploadButton } from '@ant-design/pro-form';
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
const handleAdd = async (fields: API.BannerListItem) => {
  const hide = message.loading('正在添加');
  console.log('fields.contentUrl', fields.contentUrl);
  try {
    await addBanner({
      name: fields.name,
      type: fields.type,
      priority: fields.priority,
      contentType: fields.contentType,
      //@ts-ignore
      contentUrl: fields.contentUrl?.at(0).response?.url,
      clickUrl: fields.clickUrl,
      dateRange: fields.dateRange,
      status: fields.status,
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
    await updateBanner({
      id: fields.id,
      name: fields.name,
      type: fields.type,
      priority: fields.priority,
      contentType: fields.contentType,
      // @ts-ignore
      contentUrl: fields.contentUrl?.at(0).response?.url,
      clickUrl: fields.clickUrl,
      dateRange: fields.dateRange,
      status: fields.status,
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

const BannerList: React.FC = () => {
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
  const [currentRow, setCurrentRow] = useState<API.BannerListItem>();
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.BannerListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.banner.searchTable.updateForm.nameLabel"
          defaultMessage="Banner name"
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
          id="pages.banner.searchTable.updateForm.typeLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'type',
      valueType: 'text',
      hideInForm: true,
      valueEnum: {
        BANNER: {
          text: '首页广告位',
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.banner.searchTable.updateForm.priorityLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'priority',
      render: (priority) => {
        // @ts-ignore
        return <span className={`importance importance-${priority}`}>{priority}</span>;
      },
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.banner.searchTable.updateForm.contentTypeLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'contentType',
      valueType: 'text',
      valueEnum: {
        IMAGE: {
          text: '图片',
        },
        VIDEO: {
          text: '视频',
        },
      },
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.banner.searchTable.updateForm.contentUrlLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'contentUrl',
      render: (url) => {
        // @ts-ignore
        return (
          <Image
            width={200}
            height={200}
            src={`${url}`}
            fallback="data:image/png;base64,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"
          />
        );
      },
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.banner.searchTable.updateForm.clickUrlLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'clickUrl',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.banner.searchTable.updateForm.dateRangeLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'dateRange',
      valueType: 'text',
      renderText: (dateRange) => {
        return `
              ${dayjs(dateRange[0]).format('YYYY-MM-DD HH:mm:ss')}
                ~
              ${dayjs(dateRange[1]).format('YYYY-MM-DD HH:mm:ss')}
              `;
      },
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.banner.searchTable.updateForm.statusLabel"
          defaultMessage="Description"
        />
      ),
      // key: 'state',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        // all: { text: '', status: 'Default' },
        false: {
          text: '未激活',
          status: 'Error',
        },
        true: {
          text: '激活',
          status: 'Success',
        },
      },
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.createdAtLabel"
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
          id="pages.searchTable.updateForm.updatedAtLabel"
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
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            console.log('record', record);
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
          id: 'pages.banner.searchTable.title',
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
        request={banner}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.banner.searchTable.createForm.newBanner',
          defaultMessage: 'New banner',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.BannerListItem);
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
            id: 'pages.banner.searchTable.updateForm.nameLabel',
            defaultMessage: 'banner name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.bannerName"
                  defaultMessage="Banner name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormSelect
          name="type"
          width="md"
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.typeLabel',
            defaultMessage: 'banner type',
          })}
          valueEnum={{
            BANNER: {
              text: '首页广告位',
            },
          }}
        />
        <ProFormDigit
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.priorityLabel',
            defaultMessage: 'banner priority',
          })}
          name="priority"
        />
        <ProFormSelect
          name="contentType"
          width="md"
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.contentTypeLabel',
            defaultMessage: 'banner contentType',
          })}
          valueEnum={{
            IMAGE: {
              text: '图片',
            },
            VIDEO: {
              text: '视频',
            },
          }}
        />
        <ProFormUploadButton
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.contentUrlLabel',
            defaultMessage: 'content url',
          })}
          max={1} // 限制只能上传一个文件
          action="/api/image" // SM.MS 图床上传地址
          name="contentUrl"
          onChange={handleUploadChange}
          listType="picture"
          accept="image/*" // 限制只能上传图片
        />
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.clickUrlLabel',
            defaultMessage: 'click url',
          })}
          width="md"
          name="clickUrl"
        />
        <ProFormDateTimeRangePicker
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.dateRangeLabel',
            defaultMessage: 'Date Range',
          })}
          name="dateRange"
          placeholder={[
            intl.formatMessage({
              id: 'pages.banner.searchTable.updateForm.startTimePlaceholder',
              defaultMessage: 'Start Time',
            }),
            intl.formatMessage({
              id: 'pages.banner.searchTable.updateForm.endTimePlaceholder',
              defaultMessage: 'End Time',
            }),
          ]}
        />
        <ProFormSwitch
          name="status"
          width="md"
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.statusLabel',
            defaultMessage: 'banner status',
          })}
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
          <ProDescriptions<API.BannerListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.BannerListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default BannerList;
