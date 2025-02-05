import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { ProForm } from '@ant-design/pro-form/lib';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Col, message, Modal, Row, Space } from 'antd';
import React, { useState } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.AdminUserListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.AdminUserListItem>;
};

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const [formLayoutType] = useState<LayoutType>(LAYOUT_TYPE_HORIZONTAL);

  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : null;

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

  return (
    <Modal
      width={640}
      // bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title={intl.formatMessage({
        id: 'pages.adminUser.searchTable.updateForm.adminUserConfig',
        defaultMessage: '商品配置',
      })}
      open={props.updateModalOpen}
      onCancel={() => {
        props.onCancel();
      }}
      footer={null}
    >
      <ProForm
        initialValues={{
          id: props.values.id,
          username: props.values.username,
          nickname: props.values.nickname,
          avatar:
            props.values.avatar && props.values.avatar.length > 0
              ? [props.values.avatar].map((it: any, index: number) => ({
                  url: it,
                  uid: index + 1,
                  status: 'done',
                }))
              : [],
          email: props.values.email,
          phone: props.values.phone,
          status: props.values.status,
        }}
        {...formItemLayout}
        layout={formLayoutType}
        submitter={{
          render: (props, doms) => {
            return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? (
              <Row>
                <Col span={14} offset={4}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            ) : (
              doms
            );
          },
        }}
        onFinish={props.onSubmit}
      >
        <ProFormText name="id" hidden={true} />
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.usernameLabel',
            defaultMessage: 'banner name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.adminUser.searchTable.updateForm.usernameRule"
                  defaultMessage="Banner name is required"
                />
              ),
            },
          ]}
          width="md"
          name="username"
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
          listType="picture"
          accept="image/*" // 限制只能上传图片
        />
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.emailLabel',
            defaultMessage: 'click url',
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
            defaultMessage: 'click url',
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
        <ProFormSelect
          name="status"
          options={[
            {
              //@ts-ignore
              value: true,
              label: '激活',
            },
            {
              //@ts-ignore
              value: false,
              label: '未激活',
            },
          ]}
          width="md"
          label={intl.formatMessage({
            id: 'pages.adminUser.searchTable.updateForm.statusLabel',
            defaultMessage: 'banner status',
          })}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
