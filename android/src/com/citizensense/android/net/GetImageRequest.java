package com.citizensense.android.net;

import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.net.HttpURLConnection;
import java.net.URL;

import com.citizensense.android.conf.Constants;

import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.ImageView;

public class GetImageRequest extends AsyncTask<String, Void, Bitmap> {
	/** ImageView reference. */
	private final WeakReference<ImageView> imageViewReference;
	/** The dialog displayed to the user during a request. */
	private ProgressDialog dialog;
	/** Whether or not the user needs to know about this HTTP request. */
	private boolean showPopup;
	/** Used for creating a dialog. */
	private Context context;

	public GetImageRequest(Context context, ImageView imageView,
			boolean showPopup) {
		this.context = context;
		imageViewReference = new WeakReference<ImageView>(imageView);
		this.showPopup = showPopup;
	}

	@Override
	protected Bitmap doInBackground(String... params) {
		return downloadBitmap(params[0]);
	}

	public Bitmap downloadBitmap(String path) {
		long start = System.currentTimeMillis();
		try {
			URL url = new URL(path);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setConnectTimeout(5 * 1000);
			conn.setRequestMethod("GET");
			int length = (int) conn.getContentLength();
			InputStream is = conn.getInputStream();
			if (length != -1) {
				byte[] imgData = new byte[length];
				byte[] temp = new byte[8192];
				int readLen = 0;
				int destPos = 0;
				while ((readLen = is.read(temp)) > 0) {
					System.arraycopy(temp, 0, imgData, destPos, readLen);
					destPos += readLen;
				}
				Bitmap bitmap = BitmapFactory.decodeByteArray(imgData, 0,
						imgData.length);
				return bitmap;
			}
		} catch (Exception e) {
		}
		long end = System.currentTimeMillis();
		long time = end - start;
		System.out.println(time + " ms");
		return null;

	}

	@Override
	protected void onPreExecute() {
		if (showPopup) {
			dialog = new ProgressDialog(context);
			dialog.setMessage("Downloading Image...");
			dialog.setCancelable(false);
			dialog.show();
		}
	}

	@Override
	protected void onPostExecute(Bitmap bitmap) {
		if (isCancelled()) {
			bitmap = null;
		}
		if (showPopup) {
			dialog.dismiss();
		}
		if (imageViewReference != null) {
			ImageView imageView = imageViewReference.get();
			if (imageView != null) {
				imageView.setImageBitmap(bitmap);
			}
		}
	}

}
