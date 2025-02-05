import { addAdminUser, adminUser, updateAdminUser } from '@/services/ant-design-pro/api';
import { PlusCircleFilled, UserOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Avatar, Button, Drawer, message } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import UpdatePasswordForm from './components/UpdatePasswordForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.AdminUserListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addAdminUser({
      username: fields.username,
      passwrod: fields.password,
      nickname: fields.nickname,
      email: fields.email,
      phone: fields.phone,
      //@ts-ignore
      avatar: fields.avatar?.at(0).response?.url,
      isSuperAdmin: fields.isSuperAdmin,
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
    await updateAdminUser({
      id: fields.id,
      username: fields.username,
      passwrod: fields.password,
      email: fields.email,
      phone: fields.phone,
      //@ts-ignore
      avatar: fields.avatar?.at(0).response?.url,
      isSuperAdmin: fields.isSuperAdmin,
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

const AdminUserList: React.FC = () => {
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
  const [updatePasswordModalOpen, handleUpdatePasswordModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.AdminUserListItem>();
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.AdminUserListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.adminUser.searchTable.updateForm.usernameLabel"
          defaultMessage="adminUser name"
        />
      ),
      dataIndex: 'username',
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
          id="pages.adminUser.searchTable.updateForm.nicknameLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'nickname',
    },
    {
      title: (
        <FormattedMessage
          id="pages.adminUser.searchTable.updateForm.avatarLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'avatar',
      render: (url) => {
        // @ts-ignore
        return <Avatar size="large" src={`${url}`} icon={<UserOutlined />} />;
      },
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.adminUser.searchTable.updateForm.emailLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: (
        <FormattedMessage
          id="pages.adminUser.searchTable.updateForm.phoneLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'phone',
      valueType: 'text',
    },
    {
      title: (
        <FormattedMessage
          id="pages.adminUser.searchTable.updateForm.statusLabel"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
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
          key="update"
          onClick={() => {
            handleUpdateModalOpen(true);
            console.log('record', record);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.update" defaultMessage="Update" />
        </a>,
        <a
          key="updatePassword"
          onClick={() => {
            handleUpdatePasswordModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.updatePassword" defaultMessage="UpdatePassword" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AdminUserListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.adminUser.searchTable.title',
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
        request={adminUser}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.adminUser.searchTable.createForm.newAdminUser',
          defaultMessage: 'New banner',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.AdminUserListItem);
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
            id: 'pages.adminUser.searchTable.updateForm.usernameLabel',
            defaultMessage: 'adminuser name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.adminUser.searchTable.updateForm.usernameRules"
                  defaultMessage="Banner name is required"
                />
              ),
            },
          ]}
          width="md"
          name="username"
        />
        <ProFormText.Password
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.passwordLabel',
            defaultMessage: 'adminuser name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.adminUser.searchTable.updateForm.passwordRules"
                  defaultMessage="Banner name is required"
                />
              ),
            },
          ]}
          width="md"
          name="password"
        />
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.nicknameLabel',
            defaultMessage: 'adminuser name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.adminUser.searchTable.updateForm.nicknameRules"
                  defaultMessage="Banner name is required"
                />
              ),
            },
          ]}
          width="md"
          name="nickname"
        />
        <ProFormUploadButton
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.avatarLabel',
            defaultMessage: 'content url',
          })}
          max={1} // 限制只能上传一个文件
          action="/api/image" // SM.MS 图床上传地址
          name="avatar"
          onChange={handleUploadChange}
          listType="picture-card"
          accept="image/*" // 限制只能上传图片
        />
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.emailLabel',
            defaultMessage: 'adminuser name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.adminUser.searchTable.updateForm.emailRule"
                  defaultMessage="Banner name is required"
                />
              ),
            },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: (
                <FormattedMessage
                  id="pages.adminUser.searchTable.updateForm.emailPattern"
                  defaultMessage="The phone number is in the wrong format"
                />
              ),
            },
          ]}
          width="md"
          name="email"
        />
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.phoneLabel',
            defaultMessage: 'adminuser name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.adminUser.searchTable.updateForm.phoneRule"
                  defaultMessage="Banner name is required"
                />
              ),
            },
            {
              pattern: /^(1[3-9]\d{0,9})$/,
              message: (
                <FormattedMessage
                  id="pages.adminUser.searchTable.updateForm.phonePattern"
                  defaultMessage="The phone number is in the wrong format"
                />
              ),
            },
          ]}
          width="md"
          name="phone"
        />
        <ProFormSwitch
          name="status"
          width="md"
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.statusLabel',
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
      <UpdatePasswordForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdatePasswordModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              await actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdatePasswordModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updatePasswordModalOpen}
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
        {currentRow?.nickname && (
          <ProDescriptions<API.AdminUserListItem>
            column={2}
            title={currentRow?.nickname}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.AdminUserListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AdminUserList;
